## Documentation

`docs/` holds per-feature/area documentation. Read the one that covers what you are touching. The summaries are writen to help indicate when it's likely useful for you to read. Reach for `AGENTS.md` when the material is more overview related, reach for `docs` when you want more indepth info relating to a specific feature/area.

| Doc                                                | Read it when                                                                                                                                                               |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs/<file-name>.md](docs/<file-name>.md) | <description of when to read> |
| [docs/historical-plans/<YYYY-MM-DD>-<title>.md](docs/historical-plans/<YYYY-MM-DD>-<title>.md)   | <description of when to read>       |
| [docs/other-services-panel.md](docs/other-services-panel.md) | You are touching the "People also searched for" panel (other services suggestions) on the results page, where it is placed between pages of results, how ISS4 related searches are turned back into categories or keyword searches, regenerating `related-search-flows.json`, or why `ResultsListPage` is keyed by path. |
| [docs/historical-plans/2026-10-07-other-services-panel.md](docs/historical-plans/2026-10-07-other-services-panel.md) | You want to know which options from the CAG presentation were chosen for the other services panel and why the suggestions were originally fixtures. |
| [docs/historical-plans/2026-11-05-related-searches-panel.md](docs/historical-plans/2026-11-05-related-searches-panel.md) | You want to know why the other services panel turns ISS4 related searches (raw ISS3 `q` values) back into category flows with a generated lookup table, or what sampling the real endpoint showed. |
| [docs/historical-plans/2026-10-07-typescript-migration.md](docs/historical-plans/2026-10-07-typescript-migration.md) | You want to know why the code is TypeScript with Playwright tests, how the Flow migration was done, or why something looks like a leftover from it (eg the babel plugin order in babel.config.json). |

### Citing the documentation
If the docs provide some relevent and useful info about the behaviour or context of some code then you should cite the relevent section in a code comment. Citations should be in the form of `docs/<file>.md § "<heading>"`, optionally followed by `- <the specific claim>` where the section covers several.

Citing docs is especially important for tests which should cite the requirement they are testing whenever such a requirement is listed in the docs. For example:

```ts
/** @see docs/terminal-output.md § "Defaults decide what happens in tests" */
it("takes the default when nothing can answer the prompt", () => {
```

A test name says what the code does; the citation
says _why anyone decided it should_, so someone who breaks the test can go and
read the reasoning instead of guessing at it from the assertion - and someone
changing the documented behaviour can find every test that depends on it with a
grep.

When a whole `describe` block covers one requirement, cite it once on the block rather than on every test inside it.

Make sure you only cite a stated requirement. A test for something the docs do not claim needs no reference, and inventing one to fill the slot makes the docs look more prescriptive than they are.

### Maintenance

- A change should not be considered finished if there is wrong/out-of-date info in `docs/`.
- A change that adds a concept someone would need explained — a new dialect, a
  new attribute namespace, a new output style — gets it documented in the
  relevant doc, not only in code comments.
- A new doc gets a row in the table above.
- You should create new plans under `docs/historical-plans/`
- `AGENTS.md` itself changes when a repo-wide convention or invariant does: a
  new lint rule, a new mocking boundary, a new directory with rules of its own.
- Frozen plans under `docs/historical-plans/` are exempt from all of the above.
  They are not updated as the code moves on. If one has to be edited because it
  is actively misleading someone, mark the edit inline as post-implementation,
  dated, with who changed it and why — never a silent rewrite.


## Testing

e2e scenarios must not depend on real external services. They're replaced by:

- **ISS** (including the ISS4 related searches endpoint): the mock server in
  `test/support/mock-iss/`.
- **The CMS**: the mock server started by `yarn mock-cms`.
- **Google Maps**: `test/support/fake-google-maps.js`, served in place of the
  real script by `test/e2e/run-features.ts`. Its services answer
  `REQUEST_DENIED` unless a scenario registers a mock in `window.googleMocks`
  (eg "googles directions matrix will return"). If the app starts using
  another part of the Maps API, add it to the fake.

## Creating Plans/Making Major Changes

Unless the user explicitly indicates otherwise the plan or major change should include:

- [ ] Adding full tests for all requirements.
- [ ] The plan file created in (or an exact copy put into) the `docs/historical-plans` directory with the filename `YYYY-MM-DD-title.md`.
- [ ] A docs/*.md file should be added when working on a feature that isn't covered by the existing docs, or if there is already an existing relevant doc it should be updated. If adding new feature that is a superset of an existing feature with an existing doc file consider renaming the existing file under the new superset feature name and placing it's existing contents into a new section dedicated to that subfeature.
- [ ] If the `docs/` file structure or any filenames in it have changed, AGENTS.md is updated so that every file is
  listed in the docs table and optionally if useful it's also linked in relevant sections elsewhere in the document (no
  more than 2 times).
