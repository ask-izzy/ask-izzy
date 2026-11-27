# Other services panel

The "People also searched for" panel sits in the results list and suggests
related services the user might also need. For example, someone
looking for housing may also want meals or food vouchers. It comes from the
"Ask Izzy / Google AI" presentation to CAG (slides 4–7).

Code:

- [src/components/OtherServicesPanel.tsx](../src/components/OtherServicesPanel.tsx): the panel itself
- [hooks/useOtherServicesSuggestions.ts](../hooks/useOtherServicesSuggestions.ts): loads the suggestions for the current search
- [src/utils/other-services-suggestions.ts](../src/utils/other-services-suggestions.ts): where a suggestion goes and what clicking it saves
- [src/constants/other-services-suggestions.ts](../src/constants/other-services-suggestions.ts): example suggestions for storybook
- [pages/api/search/related.ts](../pages/api/search/related.ts): the related searches endpoint, which is handled in [src/related-searches/](../src/related-searches/) (server only)
- [scripts/lib/related-search-flows.ts](../scripts/lib/related-search-flows.ts): builds the `q` → flow lookup table (written by [scripts/generate-related-search-flows.ts](../scripts/generate-related-search-flows.ts))
- [src/components/ResultsList.tsx](../src/components/ResultsList.tsx): places the panel between pages of results

## Where the panel appears

- The panel appears after each page of results. A copy therefore sits just
  before every "See more results" button, and one more sits after the last
  result once every page has loaded.
- Each copy stays where it is as more pages load. It scrolls with the results
  and isn't moved or removed.
- Page boundaries are the real ones from the ISS response
  (`PaginatedSearch.pageBoundaries`), not a fixed count. A page with fewer
  results than the page size still puts the panel where that page ended.
- Crisis results are shown separately above the list and don't count towards
  a page's position.
- No panel is shown when there are no results.

The presentation also offered a single panel after the first X results
(slide 5). That option was not chosen.

## How the panel looks

- A small "People also searched for" heading sits above a row of chips, one
  per suggestion, at every screen width.
- Chips wrap onto as many rows as they need. A chip too wide for a row by
  itself (eg "Support and counselling without mental and emotional health" on
  a phone) wraps its text onto more lines instead of running off screen.
- Keyword search chips are in quotes, eg “relief”, to set them apart from
  categories. Text that's already in quotes isn't quoted again.
- While suggestions load, each copy of the panel shows its heading and four
  grey placeholder chips that gently pulse (still for people who prefer
  reduced motion). They're the same height as a chip, so the panel doesn't
  jump when the real chips arrive. If there turn out to be no suggestions,
  the panel goes away. The browser can't tell whether ISS4 is configured, so
  where it isn't, the placeholders flash briefly before the endpoint answers
  with no suggestions.
- The panel is deliberately quiet and has no collapse control. It repeats
  after every page of results, so it shouldn't compete with the results or
  nag.

The design is direction E from the design review of 2026-10-28, chosen by
Callum over louder speech-bubble designs. An earlier version was a collapsible
"Other services you may be interested in" panel.

## Where suggestions come from

The suggestions come from ISS4's related searches endpoint
(`GET /api/directory/search/related/`). Given a search, it returns searches
people often made before or after it, based on past search sessions, most
relevant first. Ask Izzy asks for up to 8, with `segment=ask-izzy` so they're
tailored to searches made through Ask Izzy.

Once a results page knows its search, `useOtherServicesSuggestions` asks Ask
Izzy's endpoint (below) for suggestions, once per `q`. Results never wait for
suggestions, and if there aren't any the panel is hidden.

### Ask Izzy's related searches endpoint

The browser never talks to ISS4. It asks Ask Izzy's own
`POST /api/search/related` (`pages/api/search/related.ts`), which calls ISS4
and turns the results into suggestions on the server. That keeps the lookup
table (see below) out of the browser, and keeps the ISS4 token secret.

```json
POST /api/search/related
{"q": "<ISS3 q of the current search>", "currentCategory": "housing",
 "currentAnswers": {"sleep-tonight": "No", "demographics": ["Couples"]}}

200
{"suggestions": [
  {"label": "Meals", "target": {"type": "category", "categoryKey": "food",
    "answers": {"food-subcategory": "Meals"}}},
  {"label": "relief", "target": {"type": "search", "searchText": "relief"}}
]}
```

- `q` is the `q` value of the current search
  (`convertIzzySearchQueryToIss3(query).q`). Location and other params aren't
  sent. A request without a non-empty string `q` gets a `400`, and anything but
  `POST` gets a `405`.
- `currentCategory` is the key of the results page's category, and
  `currentAnswers` is the user's saved answer to every personalisation
  question. Both are only used to label suggestions (see "Labelling
  suggestions"). An unknown category gets a `400`. Answers to unknown pages,
  and answers which aren't a string (or a list of strings), are ignored.
  The answers are sensitive, eg family violence or demographics, though they
  say no more than `q` already does. So they're sent in the body rather than
  the URL.
- `target.answers` is the flow's answers as they are in the lookup table,
  including any `{"oneOf": [...]}`. Which option gets saved depends on what the
  user has saved when they click, so that's left to the browser.
- Suggestions are optional, so anything else going wrong gives
  `200 {"suggestions": []}` and the panel is simply hidden. This covers ISS4
  erroring, a 503 while its model loads, a response taking more than 3 seconds,
  and `ISS4_BASE_URL` or `ISS4_API_TOKEN` not being set. Both are server-only
  and optional.
- Ask Izzy deliberately doesn't cache ISS4's responses, so that ISS4's request
  stats stay accurate. Caching is ISS4's job.
- It's rate limited per IP (slowed after 150 requests a minute, refused after
  300) to protect the ISS4 token's quota. That's generous because it's called
  on every results page load.
- The request body is never logged.
- `src/related-searches/` is server-only code, and an ESLint rule stops
  browser code importing it.
- The lookup table isn't bundled. The server reads
  `src/related-searches/related-search-flows.generated.json` (relative to the
  working directory) the first time it's needed, and checks it's the expected
  shape with zod. If it's missing or the wrong shape, eg generated by a
  different version of the code, every request gives no suggestions and logs
  an error rather than mislabelling them.

Each related search is handled as follows:

1. **Found in the table**: it goes to that flow's category. Its base label is
   the answer to the category's subcategory question (eg "Meals"), or the
   category name if there isn't one (eg "Housing"). For a subcategory with
   `oneOf` options, it's the option that would be saved. Details are added
   when needed to tell it apart (see "Labelling suggestions").
2. **Not found, and it looks like something a person typed** (no brackets and
   no `-` exclusions): it becomes a keyword search labelled with the text,
   shown in quotes.
3. **Anything else** is dropped. It's a query the app no longer produces, eg
   from an older version of a category's search terms, or from a category that
   no longer exists.

Lookups ignore case and extra whitespace. Related searches that are the current
search are dropped. If suggestions still share a label after labelling (they
can't be told apart), only the first (most relevant) is kept.

### Labelling suggestions

Labels carry **the least detail that tells each suggestion apart** from the
other suggestions in the panel and from the current search. A suggestion
whose base label is already different (eg "Meals" next to "Food vouchers"
while on Housing) gets nothing more. One that shares its base label with
another suggestion, or with the current search, gets details added:

- **Answers it would change** say who the services are for, eg "Housing for
  people not safe tonight", "Housing for people aged 65 or older" or
  "Housing for couples".
- **Demographics it would remove** are "not just for", eg "Housing not just
  for couples", since removing one broadens the search rather than leaving
  anyone out.
- Phrases starting the same way are merged, eg "for couples and veterans".
  An answer without a "for" phrase follows a colon instead, eg
  `Housing: <answer>`.
- **The category** goes first when the same subcategory answer is in
  different categories, separated by " › ", eg "Support and counselling ›
  Homelessness support" while on Housing › Homelessness support.

Each label picks the fewest details that work, trying questions in the order
they're asked. So two "Housing" suggestions that differ in sleep tonight, age
and demographics are just "Housing for people safe tonight" and "Housing for
people not safe tonight".

**Details are always relative to the user's saved answers** (`currentAnswers`),
since that's what following the suggestion changes. An answer the user
already has (including any `oneOf` option) is never mentioned, and a question
the flow leaves alone can't be used. For example, the two crisis
accommodation flows differ only by age: for a 17 year old they're "Housing for
all ages" and "Housing", and for a 27 year old "Housing" and "Housing for under
18s". Labels which still match after picking are given the details both
picked. A suggestion for the current category which can't be told apart from
the current search at all is dropped.

The current search's own base label (what suggestions mustn't look like) is
its subcategory answer from its flow in the table, or the category name. A
saved subcategory answer the current search doesn't use (eg housing when not
safe tonight) is ignored.

Answers which don't make sense without their question get a phrase from the
page's `suggestionLabels`, eg sleep tonight "No" is "for people not safe
tonight", ages are "for people aged 18 to 26" and skipping age is "for all
ages". A phrase can say how removing the answer reads too, as the demographic
pages do with
[src/constants/demographic-suggestion-labels.ts](../src/constants/demographic-suggestion-labels.ts).
Otherwise a removed answer follows "without", eg `Housing without <phrase>`.
An answer given `null`, like "No - show me everything", counts as no
answer. **Add a "for …" phrase when adding an answer to a page whose
answers can be in labels**, including any new demographic, so labels keep
reading the same way.

Other answers are sentence case, like the answers themselves. So an answer
added part way through a label has its first word lowercased, unless that
word is an acronym (eg "LGBTIQA+") or a proper noun (eg "Aboriginal",
"Centrelink").

When sampled on 2026-11-05, 59 of 60 related searches across six searches were
found in the table. The other was plain text.

### Turning a related search back into a flow

ISS4's related searches endpoint learnt from the raw search requests Ask Izzy
has sent to ISS3, so it speaks in ISS3 `q` values, eg
`meals -(coordinating bodies) -(home care) …` rather than "Food". To turn one
back into somewhere to send the user there's a lookup table from every `q`
value the app can produce to the category and personalisation answers (the
"flow") that produces it.

The table is built by `scripts/lib/related-search-flows.ts`, which walks every
combination of answers in every category through the real query building code.
The `search` and `disability-advocacy-finder` categories are skipped, because
their query comes from the URL rather than from answers. Keys are normalised
(lowercase, collapsed whitespace) and lookups must normalise the same way.

Following a flow saves only the answers in it. Every other page keeps whatever
the user has saved, or nothing. So which answers a flow lists matters:

- **An answer is left out only if every possible answer to that page,
  including skipping it, gives the same `q`.** Otherwise it's kept, even when
  it's `(skipped)`. For example, the default food search (`meals -(coordinating
  bodies) …`) only happens when the food subcategory is skipped, because
  picking any subcategory replaces those terms. So its flow is
  `{"food-subcategory": "(skipped)"}`. Leaving it out would send someone on
  Food › Meals back to Food › Meals.
- **When several answers to a page give the same `q`, all of them are listed**
  as `{"oneOf": [...]}`. For example, most ages add no search terms.
  Skipping (or selecting nothing) is listed first.
- **An answer that shows or hides another question is never left out**, and
  it's only grouped with answers that show the same questions. Eg "Do you
  need somewhere to sleep tonight?" decides whether the housing subcategory
  is asked.
- Multiple choice answers are compared as storage saves them: sorted, with
  only the first two affecting the search.

When several flows produce the same `q`, the one that would change the
user's answers least is kept.

#### Generated at build time, not committed

The table is about 1,270 `q` values (most of them housing's many
combinations), about 420KB. It isn't committed. Instead
`yarn generate-related-search-flows` writes the gitignored
`src/related-searches/related-search-flows.generated.json`, and runs
automatically before `yarn build` and `yarn dev`. So it can't go stale and
there's nothing to remember to regenerate. Generating takes about 7 seconds,
of which about 2.6 seconds is the walk itself.

- **Only on the server, and never in the running server.** The walk writes
  each combination's answers into the global `storage` and silences
  `console.log` while it runs, so it's only ever run in its own process: the
  generator script, or a unit test.
- **Once per image, not per deploy.** The table doesn't depend on environment
  variables. So it's generated when the Docker image is built, the
  `distribution` stage copies it from the `development` stage, and
  `scripts/ix-hosting-build-to-vol.sh` runs `next build` directly so the deploy
  rebuild doesn't generate it again. Since the table is read at runtime rather
  than bundled, that script refuses to build if it's missing. The deploy rebuild can't get a cheap
  speed-up from the image's `.next/cache` instead, because that cache is only
  reused when the env vars match, and the deploy rebuild exists because they
  don't. See `docs/historical-plans/2026-11-27-server-side-related-searches.md`
  for the measurements.

## What clicking a suggestion does

- **A category flow** saves the flow's answers, then goes to the category. An
  answer the user gave before to one of those pages is replaced. For a
  `oneOf`, the user's existing answer is kept if it's one of the options.
  Otherwise `(skipped)` (or selecting nothing) is saved if it's an option, or
  else any of them, since they all give the same search. Answers to other
  pages are kept. Flows often include more than the subcategory answer, eg
  sleep tonight, age or demographics, when those change `q`.
- **A keyword search** goes to `/search/<text>`.

The link points at the bare category or search path. The results page then
works out where to go from the saved answers:

- **All details known**: a new list of matching services, with the user's
  saved location and other answers reused.
- **Extra details needed**: the personalisation wizard for the category,
  starting at the first unanswered question.

### Results pages are remounted per path

Following a suggestion goes from one results page to another, and both use the
same Next.js page component. `ResultsListPage` keeps the category, title and
search status of the path it first rendered, so
`pages/[categoryOrContentPageSlug]/index.tsx` keys it on the path (ignoring the
query string and hash). Each results path therefore gets a fresh instance.
