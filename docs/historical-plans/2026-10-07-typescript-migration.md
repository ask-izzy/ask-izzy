# Migrate from Flow to TypeScript

Plan agreed 2026-10-07 for moving Ask Izzy from Flow.js to TypeScript, and
from mocha + selenium to Playwright for the tests.

## Background

Almost all of Ask Izzy (497 of 512 non-test JS files) was written with Flow
types and compiled with Babel. Several earlier attempts at moving to
TypeScript exist as branches (`165-rebase-ts-refactor`, `165-ts-refactor`,
`draft-convert-missing-files-to-typescript`,
`188-convert-homepage-to-typescript`, `AI-typescript-setup`). The most
complete, `165-rebase-ts-refactor` (2023), converted the app by hand page by
page but stalled:

- It was 274 commits behind `main` and 200 app files had changed since it
  branched, so rebasing it was close to redoing it.
- It got stuck on tooling rather than types. It switched the repo to native
  ES modules (`"type": "module"`) and `moduleResolution: "nodenext"`, which
  required `.js` extensions on every import and a custom ts-node loader to
  run mocha. Getting the old test stack working under that setup is where it
  stopped.

The test stack (mocha 6, selenium-webdriver `4.0.0-alpha.1`, Yadda feature
files) was old enough that converting it at the same time as the app looked
like it would drag in a lot of other upgrades.

### How the tests depend on the app

Nearly all tests drive a browser through selenium over HTTP, so they don't
care what language the app is written in. Only about 8 test files import app
code directly (`src/constants/*`, `src/iss/*`, `src/utils/strings`,
`fixtures/*`), and the tests are loaded through `@babel/register`, which
strips types at load time. Babel can strip Flow and TypeScript equally well,
provided both presets aren't applied to the same file.

## Options considered

| Option | Verdict |
|---|---|
| A. Two Docker images: TS app, Flow tests | Works but costly. The app build needs the mock servers in `test/support`, `NEXT_PUBLIC_ISS_BASE_URL` is compiled into the client so the browser would need to reach the mocks across containers, and the CI workflows run one image per job. The dependency conflict it avoids mostly doesn't exist. |
| **B. One image: TS app, unchanged Flow tests via per-extension Babel config** | **Chosen.** Least infrastructure change, and the unchanged tests act as a check that the app still behaves the same. |
| C. Rebase the 2023 branch, tests included | Large drift, plus the ES module rabbit hole. |
| D. Replace the test framework first, then migrate | Reasonable, but changes the tests before there's anything to check them against. |
| E. Convert file by file over a long period | Flow and TS can't see each other's types, so type checking is lost across the boundary for months. |

The guiding rule: **never change the app and its tests in the same step.**
Each half is verified by the other while it changes.

## Plan

### Phase 0: prerequisites

1. Apply `@babel/preset-flow` only to `.js`/`.jsx` files and register
   `.ts`/`.tsx` with `@babel/register`, so Flow tests can import TS app code.
2. Add `typescript`, the core `@types/*` packages and a `tsconfig.json` using
   `moduleResolution: "bundler"`. Stay on CommonJS (no `"type": "module"`, no
   `.js` import extensions). Prove `next build` works with a `.ts` file.
3. Upgrade ESLint 5 → 8 so `@typescript-eslint` can lint `.ts` files.

### Phase 1: convert the app in one go, tests untouched

- Convert all app code with a codemod rather than by hand, in one change over
  a short freeze, so it doesn't drift again. Stripe's
  `flow-to-typescript-codemod` was the first choice, but fetching and running
  external code was blocked in this environment, so a small Babel-based
  codemod was written in the repo instead (`scripts/flow-to-ts/convert.js`).
  It only rewrites the Flow-specific parts of each file, leaving formatting
  alone.
- Keep the automated output, hand fixes, and suppression of the remaining
  type errors (`@ts-expect-error TODO(ts-migration)`) as separate commits.
- Verify with the full existing test suite plus `tsc`, and with a script that
  compiles the old Flow and new TS version of every file and diffs the output
  (`scripts/flow-to-ts/compare-compiled.js`). A pure type conversion should
  compile identically.
- Flow keeps checking the tests, with imports of app code mapped to an
  untyped stub.

### Phase 2: fix the suppressed type errors

Remove every `TODO(ts-migration)` suppression by fixing the underlying error.
Prefer type-only fixes. Any change that alters compiled output must be a
no-op or equivalent and be listed in the commit message.

### Phase 3: migrate the tests to Playwright

- Keep the Yadda `.feature` files unchanged. Their table syntax isn't Gherkin,
  so Gherkin-based tools like playwright-bdd can't read them. Keep Yadda as
  the feature parser and step matcher, and generate a Playwright test per
  scenario with each step as a `test.step`.
- Rewrite the step definitions in TypeScript against Playwright's `Page` API,
  keeping the same XPath text selectors and visibility rules. Normalise page
  text the way selenium's `getText()` did.
- Give each scenario a fresh browser context, after the same setup the old
  harness did between scenarios.
- Run the unit tests with the Playwright test runner too, so there's one
  framework.
- Use the Chromium already installed in the Docker image.
- Once the suites pass, delete mocha, selenium and the old harness, then
  remove Flow entirely (config, libdefs, preset, lint jobs).

## Known risks at the time of planning

- `next/babel` might not handle custom Babel config plus `.ts` files. (It did,
  but see below.)
- How much the codemod would leave for hand fixing.
- The GitLab CI config may be stale. (It was already calling scripts that no
  longer existed.)

## Notes added during implementation

- next/babel runs its class-properties transform before its TypeScript
  preset, so type-only class fields (eg `loadedServices: Array<Service>;`)
  were compiled into properties set to `undefined`, shadowing getters in
  subclasses. The e2e tests caught it. The fix was to run
  `@babel/plugin-transform-typescript` as a root-level Babel plugin with
  `onlyRemoveTypeImports`, so types are stripped first and only `import type`
  imports are removed, matching what Flow's preset did.
- Phase 2 turned up a few real bugs. One was left in place because fixing it
  changes behaviour: the external resources proxy uses the http-proxy-middleware
  v3 `on.error` API with v2, so its error handler never runs (marked with a
  `FIXME`).

  > **Post-implementation edit (2026-10-07, Claude at Callum Gare's request):**
  > the proxy error handler has since been fixed to use v2's `onError` while
  > still sending the default error responses, so the `FIXME` no longer exists.
