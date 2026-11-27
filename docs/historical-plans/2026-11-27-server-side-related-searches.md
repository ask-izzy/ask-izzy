# Server-side related searches, and splitting the ISS4 PR

## Context

`AI-424-4-iss4-related-searches` (PR #759, on top of `AI-424-3-suggestions-panel-ui`)
adds ISS4 related searches to the "People also searched for" panel. It's ~2,250
reviewable lines plus the 23,590 line generated `related-search-flows.json`, too
much for one review. Branches 5–8 are stacked on top of it.

On that branch the **browser** does all the work:

1. `hooks/useOtherServicesSuggestions.ts` works out the ISS3 `q`, then calls ISS4
   directly with `NEXT_PUBLIC_ISS4_BASE_URL` / `NEXT_PUBLIC_ISS4_API_TOKEN`
   (`src/iss/relatedSearches.ts`).
2. It dynamically imports `related-search-flows.json` (~350KB min / ~12–14KB gzip).
3. `src/utils/other-services-suggestions.ts` maps each result to a flow and
   builds the minimal-detail labels using the answers saved in browser storage.

We want an Ask Izzy API route that does steps 1–3 on the server, so that:

- the lookup table never ships to clients
- the ISS4 token becomes a server-only secret. At the moment `NEXT_PUBLIC_*`
  puts it in every client bundle.
- the ISS4 host no longer needs to be in `NEXT_PUBLIC_DOMAINS_ALLOWED_WITHOUT_PROXY`
- labels are worked out on the server, so the client just renders what it's given
- the mapping and labelling become pure functions with no `storage`
  dependency, which are easier to test

## The catch: labels depend on the user's saved answers

Labels are "relative to the user's saved answers" (`docs/other-services-panel.md`
§ "Turning a related search back into a flow"). For example, "Housing for people
not safe tonight" only appears if the user's saved sleep-tonight answer is different.
Those answers live in browser storage, so **the client has to send them** for the
server to label.

The client POSTs its saved answers to question pages along with `q`.
This isn't new exposure. The same answers are already encoded in the `q` the
browser sends to ISS3, and in the `q` sent to ISS4. Use POST so they stay
out of URLs and access logs, and never log the body.

(The alternative is to map on the server and label on the client. That keeps the
answers in the browser, but ships the ~400 lines of labelling code and splits the
logic across both sides. Not chosen.)

## API design

`POST /api/search/related` (`pages/api/search/related.ts`)

Request:

```json
{
  "q": "<ISS3 q of the current search>",
  "currentCategory": "housing",
  "currentAnswers": {"sleep-tonight": "No", "demographics": ["Couples"], ...}
}
```

- `q`: required string, trimmed, capped at 200 chars, as today.
- `currentCategory`: optional category key, and must be a known category if
  given. Suggestions are told apart from the current search with it.
- `currentAnswers`: the user's saved answers. Only names of personalisation
  **question** pages from `categories` are accepted. Values are a string, or an
  array of strings for multiple choice pages. Anything else is ignored. Location,
  search text and so on aren't sent.

Response `200`:

```json
{
  "suggestions": [
    {"label": "Meals", "target": {"type": "category", "categoryKey": "food",
      "answers": {"food-subcategory": "Meals"}}},
    {"label": "relief", "target": {"type": "search", "searchText": "relief"}}
  ]
}
```

- `target.answers` keeps `{oneOf: [...]}`, because which option gets saved depends
  on storage at click time. Saving stays on the client.
- The target carries `categoryKey`, not the `Category` object. The client only
  needs the key to build the path.
- Suggestions are optional, so every failure returns `200 {suggestions: []}`. That
  covers ISS4 not configured, ISS4 erroring, a 503 while its model loads, and a
  timeout. Only a malformed request gets a `400`.

On the server:

- Env: `ISS4_BASE_URL` and `ISS4_API_TOKEN`, server-only and optional. They aren't
  added to `lib/env-var-check.js`.
- Fetch from ISS4 with `AbortSignal.timeout(~3s)` (Node 20) so a slow ISS4 can't
  hold the placeholders up.
- **No caching in Ask Izzy.** Every request goes to ISS4, so ISS4's request stats
  stay accurate. Caching will be added at the ISS4 level.
- Rate limit with `getRateLimitMiddlewares` as `share-services.ts` does, but
  generously, since this runs on every results page load. It protects the ISS4
  token's quota.

### Generating the lookup table: at build time, not committed

Measured on 2026-11-27, the generator takes 7.4s via
`yarn generate-related-search-flows`. Of that, 2.6s is the walk itself, which is
synchronous CPU work. The rest is babel-node startup and transpiling.

The options considered:

| Option | For | Against |
| --- | --- | --- |
| Commit the JSON (the current approach) | No cost at runtime. A category change shows up as a diff in the table. | A 23,590 line file in the repo. A staleness test. People have to remember to regenerate. |
| Generate in the server process at startup | No file at all. | The walk works by writing each combination's answers into the global `storage` (an in-memory polyfill on the server) and silencing `console.log` for the whole process. That's unsafe in a live server unless the walk is rewritten not to touch globals. It also costs ~2.6s of blocked CPU per process start, or for whichever request comes first. |
| **Generate at build time** (chosen) | No file in the repo and nothing to go stale. No runtime cost. It runs in its own process, so the globals don't matter. Run once when the Docker image is built in CI (see below). | Has to run before anything that imports the table. |

Why not just let the deploy rebuild run the generator too? The deploy rebuild
(`yarn serve` builds once per ECS task revision, `scripts/ix-hosting-build-to-vol.sh`)
gets almost nothing from the `.next/cache` that CI leaves in the image. Measured
locally on 2026-11-27 with `next build` (Next 14.2, 238 static pages):

| Build | Total | Compile |
| --- | --- | --- |
| Cold, CI env (`--test-env`) | 26s | 15s |
| CI cache, same CI env | 14s | 5s |
| CI cache, same env, every source file's mtime changed (like `COPY . .`) | 11s | warm |
| CI cache, CI env with one `NEXT_PUBLIC_*` value changed | 20s | partly warm |
| CI cache, production env (as on deploy) | 28–30s | 20s |
| Cold, production env | 29s | 20s |

The cache only helps when the env vars match, and the deploy rebuild exists
precisely because they don't. So the generator's ~7s would be paid in full on
every deploy, which is worth avoiding.

How it works:

- The generator writes `src/related-searches/related-search-flows.generated.json`,
  which is gitignored. The server module imports it statically, so webpack inlines
  it into the server bundle in `.next/` and it travels with the build.
- Locally, Yarn 1 `pre` hooks run the generator before `build` and `dev`
  (`prebuild`, `predev`), and before typecheck and the unit test scripts. That
  way a fresh clone works without a manual step.
- **Generated once in CI, not again on deploy.** The table doesn't depend on env
  vars, so it's generated when the Docker image is built, and the deploy rebuild
  reuses it. Concretely:
  - the `distribution` stage copies the generated file from the `development`
    stage, as it already does for `.next`
  - `scripts/ix-hosting-build-to-vol.sh` runs `next build` directly rather than
    `yarn build`, so the `prebuild` hook doesn't regenerate it
  - if the file is missing, the static import fails the deploy build loudly
    rather than shipping without suggestions

  This saves the ~7s the generator would add to every deploy.
- Unit tests call `buildRelatedSearchFlows()` in memory where they need flows,
  rather than relying on the file.
- The staleness spec, `.gitattributes` entry and "remember to regenerate" docs go.
  They're replaced by spot-check specs (eg the default food `q` gives
  `{"food-subcategory": "(skipped)"}`).
- We lose the table diff in reviews. If that's wanted, a reviewer can run the
  generator on both branches and diff the results.

### Splitting `src/utils/other-services-suggestions.ts`

| Server: `src/related-searches/` (new)                                   | Client: `src/utils/other-services-suggestions.ts` (slimmed)          |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `fetchRelatedSearches` (moved from `src/iss/relatedSearches.ts`)        | `OtherServicesSuggestion` / target types (shared, JSON-serialisable) |
| `normaliseIss3Q`, `isPlainSearch`, flow lookup                          | `getOtherServicesSuggestionPath`                                     |
| `getMinimalLabels` and the label helpers, taking `currentAnswers` instead of reading `storage` | `saveOtherServicesSuggestionAnswers`, `isSavedAnswer`, `getAnswerToSave` |
| `getOtherServicesSuggestions(related, q, flows, currentCategory, currentAnswers)` | `quoteSearchText`                                                    |
|                                                                         | `getCurrentAnswers()` (builds the request body)                      |

`getAnswerToSave`/`isNoAnswer` are needed on both sides. Put them in a small shared
module with no imports from either side.

**Keeping the table out of the client bundle:** nothing under `components/`,
`hooks/` or `src/components/` may import `src/related-searches/`. Enforce this with
an ESLint `no-restricted-imports` rule (and note it in `AGENTS.md`). Also check by
building and grepping `.next/static` for a distinctive `q`, eg
`-(meals on wheels)`. Importing `categories` on the server is already known to be
safe, because the generator does it under Node.

### Client

`hooks/useOtherServicesSuggestions.ts` POSTs `{q, currentCategory, currentAnswers}`
and returns `{suggestions, isLoading}` as before. The effect re-runs when `q`, the
category or the answers change. That matters for branch 8, where going back
restores answers without changing the URL. It ignores stale responses as today.

Placeholders: the client can no longer tell whether ISS4 is configured. It always
shows placeholders until the response arrives. With ISS4 unconfigured, the
server answers at once with `[]`, so they only flash briefly, and only in
environments without ISS4. Drop the "Placeholders aren't shown when ISS4 isn't
configured" line from the docs.

## Splitting the PR

Rebuild the work as four stacked branches off `AI-424-3-suggestions-panel-ui`. Use
the existing branch as source material rather than adding a "move to server"
commit on top, which would make the diff bigger. Each branch builds, passes tests
and leaves the app working.

| Branch                              | Contents                                                                                                                                                                                                                                                                                         | Rough reviewable size |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `AI-424-4a-related-search-flows`    | Generator (`scripts/lib/related-search-flows.ts`, `scripts/generate-related-search-flows.ts`), the `pre` hooks, `.gitignore` entry, spot-check spec. Docs: the lookup table part of § "Turning a related search back into a flow". Nothing uses it yet. | ~400                  |
| `AI-424-4b-related-searches-api`    | `src/related-searches/` (ISS4 fetch, lookup, base labels only: subcategory answer or category name, plain text becomes a search, unusable results dropped, current search dropped, first label wins). `pages/api/search/related.ts` with validation, timeout and rate limit. Server env vars, mock ISS route, `.env.test`. Unit tests for the fetch, mapping and handler. Docs § "Where suggestions come from". | ~550                  |
| `AI-424-4c-related-searches-panel`  | Hook, `ResultsListPage` wiring, `izzyQuery` from `useServiceResults`, the panel taking `OtherServicesSuggestion[]`, loading placeholders, quoted search chips, saving flow answers on click (`oneOf` handling), stories, feature 82. Docs § "How the panel looks" and § "What clicking a suggestion does". | ~500                  |
| `AI-424-4d-suggestion-labels`       | Minimal-detail labels: `getMinimalLabels`, `suggestionLabels` on personalisation pages and its type, `demographic-suggestion-labels.ts`, "for"/"not just for" wording, the client posting `currentAnswers`. The large labelling spec. Docs: the labelling paragraphs.                                    | ~900                  |

Notes:

- 4d is still the largest PR, but it's one self-contained concern, mostly
  tests. If that's still too much, the "for"/"not just for"
  phrasing (`suggestionLabels`, `demographic-suggestion-labels.ts`) can move to a
  4e. Until then, 4d would use the plain `Housing: <answer>` form.
- If four PRs is too many, 4b and 4c can be merged. 4b on its own is an endpoint
  that nothing calls yet.
- The 2026-11-05 plan describes the browser calling ISS4 and a committed table.
  It lands in 4a with a dated, inline post-implementation note that points
  here, as AGENTS.md requires for a misleading frozen plan.

### Then rebase 5–8

Rebase `AI-424-5` through `AI-424-8` onto `AI-424-4d` in order (`git rebase --onto`).
Expected conflicts:

- `components/pages/ResultsListPage.tsx` (5–8) and `test/features-2/82-other-services-panel.feature`
  (5, 7, 8): mostly context only.
- `hooks/useServiceResults.ts` (8): context only.
- `src/utils/other-services-suggestions.ts` (8): `rememberAnswersForCurrentPage` in
  `saveOtherServicesSuggestionAnswers`. The function stays in the client file, so
  this should apply cleanly or need only a trivial fix.
- `docs/other-services-panel.md` (5–8): section moves.

Then force-push 5–8, close or retarget #759 (eg reuse it for 4a), and retarget
#760's base to `AI-424-4d`. Every branch op, push and PR change gets asked for first.

## Tests (cite `docs/other-services-panel.md` sections)

- `test/unit/related-search-flows.spec.ts`: spot checks on `buildRelatedSearchFlows()`
  in place of the staleness check (4a).
- `test/unit/related-searches.spec.ts`: the server fetch uses server env vars, and
  returns `[]` on missing config, error, 503 or timeout (4b).
- `test/unit/search-related-api.spec.ts` (new): validation (bad `q`, unknown
  `currentCategory`, unknown or non-question pages in `currentAnswers` dropped),
  `200 []` on ISS4 failure, response shape (4b).
- `test/unit/other-services-suggestions.spec.ts`: split into a server labelling spec
  (now passing `currentAnswers` instead of mocking storage) and a client spec for
  path, quoting and saving (4c and 4d).
- Feature 82: chips come from the mock ISS via the API route. Add a scenario showing
  that the label changes with saved answers, eg "Housing for people not safe
  tonight", which proves the answers reach the server (4d). Run with build+start
  and mocks as CI does.
- Bundle check: after `yarn build`, `.next/static` contains no lookup table `q`
  strings (manual in 4b, or a CI script if wanted).

## Docs

- `docs/other-services-panel.md`: § "Where suggestions come from" describes the API
  route, server env vars, timeout, that Ask Izzy deliberately doesn't cache, and
  why answers are posted (and that they're never logged). Remove the
  `NEXT_PUBLIC_DOMAINS_ALLOWED_WITHOUT_PROXY` advice. Replace "the table is
  committed … run `yarn generate-related-search-flows`" with "generated at build
  time". Update the code links (`pages/api/search/related.ts`,
  `src/related-searches/`).
- `.env.development.local.sample`, `types/env-vars.d.ts`: `ISS4_BASE_URL` and `ISS4_API_TOKEN`.
- `AGENTS.md`: a docs table row for this plan, and the `no-restricted-imports`
  boundary. The ISS mocking note already covers the related searches endpoint.

## Deployment

- Set `ISS4_BASE_URL` / `ISS4_API_TOKEN` in each environment, and remove the
  `NEXT_PUBLIC_ISS4_*` vars.
- Check that the Ask Izzy **server** can reach the ISS4 host. Until now only browsers
  called it, so egress, firewall and `HTTP_PROXY` haven't been tested for it.

## Verification

- Each branch: `yarn lint` (whole repo, plus the storybook check), typecheck, unit tests, feature 82.
- A fresh clone with no generated file: `yarn dev`, typecheck and unit tests all work.
- With real iss4-2 env: the browser network tab shows one `POST /api/search/related`
  per results page and no ISS4 calls. Chips match the old branch's on food, housing
  and free-text searches.
- Unset `ISS4_*`: the panel hides after a brief flash of placeholders, with no errors.
- No lookup table `q` strings appear in `.next/static`.
