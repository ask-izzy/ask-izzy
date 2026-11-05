# Related searches for the "People also searched for" panel

## Context

`OtherServicesPanel` currently shows a fixed list of four labels from
`src/constants/other-services-suggestions.ts` on every results page. We want
real suggestions from ISS4's `GET /api/directory/search/related/`
(`query`, `segment=ask-izzy`, `limit` → `{query, segment, results: string[]}`,
503 + Retry-After while the model loads).

The endpoint is trained on Ask Izzy's past searches. So both `query` and each
result are **raw ISS3 `q` strings**, eg `meals -(coordinating bodies) -(home care) …`.
To turn a result back into something clickable, we need a lookup table from every
`q` the app can produce to the category + personalisation answers (the "flow") that
produces it. `stash@{1}` ("create query map", `scripts/generate-search-request-map.ts`)
already walks every flow through the real query-building code and builds a
`by-q` map. It matches this branch's `convertIzzySearchQueryToIss3`.
`stash@{0}` is the ISS4 variant and isn't used.

Decisions made with the user:
- Lookup table: **committed generated JSON + a unit test that fails if it's stale**.
- Unmatched results: **keyword search if the string has no ISS3 syntax**, otherwise dropped.
- Chip label: **subcategory answer, else category name**, deduped, excluding the current search.
- User will put a valid iss4-2 token in `.env.local` and point `NEXT_PUBLIC_ISS4_BASE_URL` at
  `https://iss4-2.test.ixapps.org`. The current token gets a 401 there.

## Step 0: Sample the real API (before coding the mapping)

With the fixed token, curl `/search/related/?segment=ask-izzy&query=<q>` for the `q`s of a
handful of flows (food, food›Meals, housing›Emergency accommodation, a free-text search).
Confirm that:
- results really are ISS3 `q` strings, and how many hit the lookup table exactly
- whitespace/ordering quirks, which would mean normalising (eg collapse whitespace, trim) on both sides
- what plain free-text results look like

Save a few real responses as test fixtures. Adjust the normalisation/heuristics below if reality differs.

## Implementation

### 1. Lookup table generator
- `scripts/lib/search-flow-map.ts`: take the walk from `stash@{1}`
  (`git show stash@{1}^3:scripts/generate-search-request-map.ts`): `walkPages`,
  `getSearchQueryModifiers`, `getIss3Query`, `getAnswersAffectingQ`. Export
  `buildRelatedSearchFlows(): Record<q, {category, answers}>`.
  - Skip `search` and `disability-advocacy-finder` (their query comes from the URL, not answers).
  - When several flows produce the same `q`, keep the one with the fewest answers. For `{oneOf}`, take the first option.
  - Normalise `q` keys with the same function used at lookup time.
  - Silence `console.log` during the walk, as the stash does.
- `scripts/generate-related-search-flows.ts` + `package.json` script `generate-related-search-flows`
  (babel-node, same pattern as the stash) writes the sorted JSON to
  `src/constants/related-search-flows.json`.

### 2. Fetching related searches
- `src/iss/relatedSearches.ts`: `fetchRelatedSearches(q: string): Promise<string[]>` using
  `getRequestWithToken` from `src/ix-web-js-client/lib/requests.ts`, with
  `NEXT_PUBLIC_ISS4_BASE_URL` / `NEXT_PUBLIC_ISS4_API_TOKEN`, `segment=ask-izzy`, `limit=8`.
  Any error/503, or unset env vars, gives `[]` (the panel hides itself on an empty list).
- Env: add both vars to `types/env-vars.d.ts` and `.env.development.local.sample`. Keep them
  **optional** in `lib/env-var-check.js`, so a missing config hides the panel instead of breaking
  the build. `.env.test` points `NEXT_PUBLIC_ISS4_BASE_URL` at the mock ISS.

### 3. Mapping results to suggestions
Rework `src/utils/other-services-suggestions.ts`:
- `type OtherServicesSuggestion = {label, target}`. Targets are `category` (with `answers`
  that can be `string | string[]`) or `search`.
- `getOtherServicesSuggestions(results, currentQ)`:
  1. Normalise each result and look it up in `related-search-flows.json` to get a category target.
     The label is the `<category.key>-subcategory` answer if present, else `category.name`.
  2. Otherwise, if it looks plain (no `-(`, `(`, `)`, leading `-`), it becomes a search target
     labelled with the string.
  3. Otherwise drop it.
  4. Drop results equal to `currentQ`, dedupe by label, keep API order.
- `saveOtherServicesSuggestionAnswers`: use `storage.setJSON` for array answers, `setItem` otherwise.
- `getOtherServicesSuggestionPath` is unchanged.
- Remove the label-matching `getOtherServicesSuggestionTarget` and `normaliseLabel`, which are no longer used.

### 4. Wiring
- `hooks/useRelatedSearches.ts`: given `search?.izzyQuery`, compute
  `convertIzzySearchQueryToIss3(query).q` (from `src/iss/serviceSearch.ts`), fetch once per
  `q`, and return `OtherServicesSuggestion[]`.
- `components/pages/ResultsListPage.tsx`: use the hook (expose `izzyQuery` from
  `hooks/useServiceResults.ts` or read `search` via `useServiceResultsContext`). Pass the result to
  `renderOtherServicesPanel` in place of the fixture import.
- `src/components/OtherServicesPanel.tsx`: the prop becomes `suggestions: OtherServicesSuggestion[]`.
  Keep `key`/analytics `eventLabel` as `label`.
- `src/constants/other-services-suggestions.ts`: keep as a storybook/test fixture of
  `OtherServicesSuggestion[]`, and update `OtherServicesPanel.stories.tsx`.

### 5. Tests (cite `docs/other-services-panel.md` sections)
- `test/unit/related-search-flows.spec.ts`: `buildRelatedSearchFlows()` deep-equals the committed JSON
  (failure message: run `yarn generate-related-search-flows`), plus spot checks such as the food `q` → food with no answers,
  and food›Meals.
- `test/unit/other-services-suggestions.spec.ts`: rewrite for matched category, subcategory label, plain → search,
  syntax-only → dropped, dedupe, current-search excluded, array answers saved via `setJSON`.
- `test/unit` for `fetchRelatedSearches`: request params, and `[]` on error/503/missing env.
- Mock ISS (`test/support/mock-iss/index.ts`): add `GET /api/directory/search/related/` returning
  fixture results (from Step 0 samples).
- Update `test/features-2/82-other-services-panel.feature` and `test/e2e/steps/results.ts` so chips come
  from the mock, and clicking one lands on the right category/subcategory results.
  Run e2e with build+start + mocks as in CI (`yarn test-dev-*` is broken locally).

### 6. Docs
- `docs/other-services-panel.md`: rewrite "Where suggestions come from" (related endpoint, ISS3 `q`
  round-trip, lookup table and how to regenerate it) and "What clicking a suggestion does" (flow
  answers saved, plain → search, others dropped, empty/error hides panel).
- `docs/historical-plans/2026-11-05-related-searches-panel.md`: copy of this plan.
- `AGENTS.md`: add a docs table row for the new plan.

## Verification
- `yarn generate-related-search-flows`, then inspect the JSON size and a few entries.
- Unit tests and lint/typecheck pass.
- Run the app with real iss4-2 env. On food, housing and free-text results pages, the chips are sensible,
  clicking goes to the right category (or wizard if answers are missing), and the network tab shows a single related call per page.
- Unset `NEXT_PUBLIC_ISS4_BASE_URL`: the panel is hidden and there are no errors.
- e2e feature 82 passes against the mock.

## Notes from implementation (2026-11-05)

- Step 0 sampling: 59 of 60 related searches across six searches were found in
  the lookup table exactly. The other ("relief") was plain text. So the ISS3 `q`
  round-trip works as hoped.
- The generated table has 1268 `q` values, of which 1102 are housing (sleep-tonight
  × subcategory × age × demographics). It's ~350KB minified / ~12KB gzipped, so
  it's loaded with a dynamic `import()` from the hook rather than bundled with
  the panel. That's why `getOtherServicesSuggestions` takes the table as an
  argument.
- The generator lives in `scripts/lib/related-search-flows.ts` (not
  `search-flow-map.ts` as planned) and the hook is `useOtherServicesSuggestions`.
- Some flow `q` values are also plausible free text (eg "meals", "centrelink").
  The table wins, which sends people to the subcategory rather than a keyword
  search.
