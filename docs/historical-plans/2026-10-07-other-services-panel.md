# Other services panel

Implementation plan for the "Other services you may be interested in" panel
from `CAG Presentation.pptx` ("Ask Izzy / Google AI", slides 4–7).

## Source requirements

From the deck:

- Slide 4: scroll through results; no panel within the first results.
- Slide 5 (option A): show the panel once, after X results. It stays when
  scrolled past, isn't shown again after later results, and is expanded by
  default but collapsible.
- Slide 6 (option B): show the panel before each "See more results" request and
  at the very end of the results. Each panel stays in place as the next set of
  results loads.
- Slide 7: clicking a suggestion
  - with every detail known shows a new list of matching services,
  - with extra details needed shows the personalisation wizard for the category,
  - with no matching category does a keyword search.

## Decisions (from Callum, 2026-10-07)

- **Placement:** option B (slide 6), before each "See more results" and at the
  end.
- **Suggestion source:** fixtures for now. The deck's "Google AI" source is
  future work.
- **Collapsing:** expanded by default and collapsible. Collapsing one copy
  collapses them all.

## Approach

1. `PaginatedSearch` records the number of loaded services at the end of each
   page (`pageBoundaries`). `useServiceResults` exposes it.
2. `ResultsList` splits the non-crisis results into one `<ol>` per page and
   renders an optional `renderAfterPage()` slot after each non-empty page.
   Crisis results are subtracted from the boundaries because they are shown
   separately.
3. `OtherServicesPanel` is a native `<details>` with the suggestions as links.
   `ResultsListPage` holds the shared expanded state.
4. Suggestions are plain labels (`src/constants/other-services-suggestions.ts`),
   matching what an AI would return. `getOtherServicesSuggestionTarget` maps a
   label to a category (by name), to a category plus subcategory answer, or to a
   keyword search. The link goes to the bare category or search path, and the
   click saves any subcategory answer. The existing results-page redirect then
   picks results or the wizard.
5. Key `ResultsListPage` on the path so that moving between results pages
   doesn't reuse stale category, title or search state.

## Checklist

- [x] Unit tests for suggestion matching (`test/unit/other-services-suggestions.spec.ts`)
- [x] e2e feature for placement, collapsing and the three click behaviours
      (`test/features-2/82-other-services-panel.feature`)
- [x] Feature doc (`docs/other-services-panel.md`)
- [x] AGENTS.md docs table updated
- [x] Storybook story for the new component
