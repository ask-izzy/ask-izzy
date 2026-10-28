# Other services panel

The "People also searched for" panel sits in the results list and suggests
related services the user might also need. For example, someone
looking for housing may also want meals or food vouchers. It comes from the
"Ask Izzy / Google AI" presentation to CAG (slides 4–7).

Code:

- [src/components/OtherServicesPanel.tsx](../src/components/OtherServicesPanel.tsx): the panel itself
- [src/utils/other-services-suggestions.ts](../src/utils/other-services-suggestions.ts): turns a suggestion into a destination
- [src/constants/other-services-suggestions.ts](../src/constants/other-services-suggestions.ts): the suggestions (fixtures)
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
- On narrow screens the chips stay in one row that scrolls sideways, which
  keeps the panel short. From 800px wide (`$viewport-is-wide`) they wrap onto
  more lines instead.
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
