# Other services panel

The "People also searched for" panel sits in the results list and suggests
related services the user might also need. For example, someone
looking for housing may also want meals or food vouchers. It comes from the
"Ask Izzy / Google AI" presentation to CAG (slides 4–7).

Code:

- [src/components/OtherServicesPanel.tsx](../src/components/OtherServicesPanel.tsx): the panel itself
- [src/utils/other-services-suggestions.ts](../src/utils/other-services-suggestions.ts): turns a suggestion into a destination
- [src/constants/other-services-suggestions.ts](../src/constants/other-services-suggestions.ts): the suggestions (fixtures)
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
- The panel is deliberately quiet and has no collapse control. It repeats
  after every page of results, so it shouldn't compete with the results or
  nag.

The design is direction E from the design review of 2026-10-28, chosen by
Callum over louder speech-bubble designs. An earlier version was a collapsible
"Other services you may be interested in" panel.

## Where suggestions come from

For now the suggestions are a fixed fixture list in
`src/constants/other-services-suggestions.ts`. Every results page shows the same
list. The plan is for Google AI to generate them from what the user searched
for, so each suggestion is a plain text label, not a reference to a category.
The app maps labels to destinations itself (see below), so a generated list can
replace the fixtures without changing the panel.

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
  rebuild doesn't generate it again. The deploy rebuild can't get a cheap
  speed-up from the image's `.next/cache` instead, because that cache is only
  reused when the env vars match, and the deploy rebuild exists because they
  don't. See `docs/historical-plans/2026-11-27-server-side-related-searches.md`
  for the measurements.

## What clicking a suggestion does

`getOtherServicesSuggestionTarget` matches the label against the categories
shown on the home page. Matching ignores case and punctuation and treats `&` as
"and". It checks in this order:

1. **A category name** (eg "Housing") goes to that category.
2. **A subcategory answer** (an answer on a `<category key>-subcategory`
   personalisation page, eg "Meals" for Food, "Drugs & Alcohol Counselling" for
   Support and counselling) saves that answer, then goes to the category. Any
   answer the user gave on that subcategory page before is replaced.
3. **Anything else** becomes a keyword search for the label (`/search/<label>`).

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
