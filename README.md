# Ask Izzy

## Dependencies

If you're working on this codebase, some understanding of the following will
help:

 * Node (version 12)
 * npm (versions 6.x and above)
 * yarn
 * webpack
 * React
 * jsx (inline templating)
 * babel (es6 transpiler)
 * [flow typesystem](http://flowtype.org)
 * mocha (unit testing)
 * yadda (BDD testing)

## Getting the code

Run the following terminal commands:

```bash
git clone git@github.com:ask-izzy/ask-izzy.git
cd ask-izzy
yarn
```

## Running the dev server

You will need to create a file in the root directory called `.env` with environment variables for the [ISS](https://api.serviceseeker.com.au/) and Google API keys plus any desired optional env keys like `FAIL_FAST` (see *Development debugging* section for more).

```bash
# Contents of .env
ISS_URL="https://<username>:<token>@<iss domain>"
GOOGLE_API_KEY="Rlf90...S0fwV"
FAIL_FAST=true
```

You can then start the dev server like so:

```bash
docker-compose up
```

Once started it should then be accessible at [http://localhost:8000/](http://localhost:8000/).

Alternatively you can run it without docker via:
```bash
ENVIRONMENT="dev_local" NODE_ENV="development" ISS_URL="$ISS_URL" GOOGLE_API_KEY="$G_API_KEY" ./script/dev-server
```

## Remote access
By default the dev server is only accessible via localhost but if you want to access it via a remote machine (say for example to test the site on a phone) you should set the env var ALLOWED_HOSTS to the host name of the machine you're running the site on.

## Dealing with HTTP and browsers

Ask Izzy is a fully static site in production
(see `conf/nginx.conf` for the rewrite rules that make this
work - there is duplicated logic from `routes.js`).

Pages which do not require ISS data are pre-generated and generally work
without javascript.
See `HtmlDocument.js`, `server/render-static.js` (prod) and `server/render.js` (dev).

Once the page JS loads:

 * React attaches the react-router component to the document
 * react-router looks at the page url to decide which components to render (see `routes.js`)
 * component 'mount' hooks fire and start fetching data from ISS
 * components build a model of the DOM they expect (in `render`)
 * the page is updated with any differences between the expected DOM and actual DOM (usually none)
 * once any async data arrives from ISS, the page is updated again

## Ask Izzy Routes

Here are the explict paths that AskIzzy supports:

````
/service/<service-id>
/service/<service-id>/

/search/<search-term>
/search/<search-term>/
/search/<search-term>/<personalise-path>
/search/<search-term>/<suburb>-<state>
/search/<search-term>/<suburb>-<state>/
/search/<search-term>/<suburb>-<state>/<personalise-path>
/search/<search-term>/in/<suburb>-<state>
/search/<search-term>/in/<suburb>-<state>/

/category/<category-name>
/category/<category-name>/
/category/<category-name>/in/<suburb>-<state>
/category/<category-name>/in/<suburb>-<state>/

/<category-name>
/<category-name>/
/<category-name>/<suburb>-<state>
/<category-name>/<suburb>-<state>/
/<category-name>/<suburb>-<state>/<personalise-path>
/<category-name>/<personalise-path>

/<static-pages>
/<static-pages>/
````

Examples for routes terms are given below:

````
<service-id> e.g. 820532-infoxchange
<personalise-path> e.g. personalise/, personalise/summary, personalise/page/location
<category-name> e.g. housing, food, money-help
<suburb> e.g. Melbourne, Richmond, Run-O-Waters
<state> e.g. VIC, NSW, Victoria
<static-pages> e.g. about, homeless-shelters
````

Note: Ask Izzy categories or static pages must NEVER be named "search", "static", "session", "service", "category" or "in".

### Building HTML pages

See `server/render-static.js`.

### Building JS and CSS

Ask Izzy uses Webpack to organize building JS / CSS.

Webpack configuration is very powerful but unfortunately quite complex.
The current configuration compiles javascript files using babel (for JSX and flow) and CSS files using sass,
then writes the result to `public/static/main-<MD5>.<css|js>`.
The file `server/webpack-stats.json` is also generated, so that our code can find the
path to the files.

By convention, we have one SCSS and one JS file per react component.
Each component renders an element with a `class` equal to the name of the component.
This class is used in the SCSS file to avoid rules applying to the wrong component.
`script/generate-component-index` is required to be manually run each time you introduce a new react component.

## Javascript features

The babel compiler and polyfill allows us to use advanced features
which are not yet available in all browsers.

### Promises, async and await

We've used `async` and `await` extensively in Ask Izzy.
Under the hood these are syntactic sugar for promises
(which are well documented online).

Any function defined as `async function foo()` will
have its return value converted to a promise (any
exception will result in a promise error and the
result is the promise result).

Within an `async function`, you can use `[my variable] = await [a promise]`
which will pause the function until the given promise
resolves to a value or an error. If it's a value it's
returned, if the promise has an error an exception is
raised.

Promises are part of the JS standard and are supported
natively in every browser except IE (where they are polyfilled),
but async and await are not yet standardized (see
https://github.com/tc39/ecmascript-asyncawait
for the in-progress standard).

## Search query generation

When a `ResultsPage` is added to the page, it builds a query
by calling `issParams` which iterates through
`personalisationComponents` (inherited from `BaseCategoriesPage`)
and calls `getSearch` to build up a search object which is
passed to `search` in `iss.js`.

For category pages, `BaseCategoriesPage` checks `constants/categories.js`
to get the list of personalisation components.

If any personalisation component has not been answered, it
will return `null` from `getSearch`, and the `ResultsPage`
will redirect to the personalisation page to answer the question.

The whole personalisation space is a twisty mess of side effects
and inheritance. Changes which fit into the existing model are
super easy but I would be very careful testing any changes to
the control code.

The question classes mostly derive from `BaseQuestion` or `BaseMultiQuestion`.

## Google services

### Analytics
The Google Tag Manager (GTM) tracker is enabled if the required environmental variables are set. Google Analytics (GA) can be configured via GTM.

For Infoxchange devs see the internal dev wiki for specifics on GTM/GA dev and testing workflow in the Infoxchange context.

#### Google Tag Manager
Required environment variables:
```yaml
GOOGLE_TAG_MANAGER_ID: 'GTM-ABC123'
GOOGLE_TAG_MANAGER_AUTH: 'a1b2c3d5e6f7g8'
GOOGLE_TAG_MANAGER_ENV: 'env-1'
```

GTM events are triggered by the `sendEvent` method in `google-tag-manager.js` like so:
```javascript
import sendEvent from "./google-tag-manager";
sendEvent({
    event: "categoryPageLoad",
    additionalData: "foo",
    additionalData2: "bar",
});
```

Note: Due to the way the GTM client JS file is proxied the GTM debug console cannot be triggered as normal. (Technical side note: the normal way relies on setting cookies which are scoped to the domain which the GTM JS file is served from.) Instead it can be enabled by including query string parameter "gtm_debug" set to a true value. For example: http://localhost:8000/?gtm_debug=1

### Maps

We use the react-google-maps component to handle the maps integration.

### Directions / travel times

We use the google directions matrix API to fetch transit / walking times.
See `maps.js` for the implementation, called from `iss.js`

### Places autocomplete

We use the google places API to autocomplete place names.
See `locationSuggestions.js` for implementation.

This approach means that we frequently have bugs where a location
is known to google but not ISS. The obvious fix would be to use ISS
as the source of location autocomplete data.

## Outstanding issues

The search implementation attempts to build a free-text query.
This is fundamentally not really a workable approach but for
organisational and technical reasons it's very difficult to
make changes to ISS3 which serves the queries.

## Development debugging
The following environment variables an be set to any string in order to enable different behaviours to assist debugging:
  - DEBUG
  This will increase the verbosity of a number of scripts, usually printing each command before it's executed in shell scripts.

  - SCREENSHOT_FAILURES
  This will generate screenshots when a test fails.

  - FAIL_FAST
  Setting this flag will halt testing as soon as one test fails. This also include the pa11y lint/test.

  - PAUSE_AFTER_FAIL
  If true this will wait before exiting after test failure to allow a chance to manual debug the situation while the Ask Izzy and Mock ISS servers are still running.

## Linters
A number of linters are used for assessing and maintaining code quality. These are useful to run during development but are also used by the CI system and pre-commit git hooks.

All linters except for hadolint and pa11y can be run using `docker-compose run --rm app lint`

### ESLint
ESLint lints JavaScript code quality and is configured using the `.eslintrc` file.

Issues that can be automatically fixed can be resolved using `docker-compose run --rm app lint-fix-eslint`.

### Flow
Flow is a static type checker similar to TypeScript. JS files in Ask Izzy include additional non-standard markup which is used by Flow to help assess type correctness. As this markup is not understood by any JavaScript engines babel is used to strip this away before execution.

Flow can be run on it's own using `docker-compose run --rm app shell -c "npx flow-bin"`.

Config is done with the `.flowconfig` file and files starting with `/* @flow */` are checked for type correctness while files starting with `/* $FlowIgnore */` are not. Libraries which aren't part of the code have type definitions in the `interfaces` directory.

### sass-lint
sass-lint is used for linting sass files.

Issues that can be automatically fixed can be resolved using `docker-compose run --rm app lint-fix-sass`

### hadolint
hadolint is used for linting the Dockerfile. It can be run using `make lint-dockerfile`.

### JSONLint
JSONLint is currently only used for linting `package.json`.

### pa11y
pa11y is used for automated accessibility testing. It can be run using `docker-compose run --rm app lint-pa11y`. To ignore existing issues and only report new ones add the argument `--ignore-existing-issues`. Keep in mind this command is effected by the `FAIL_FAST` environmental variable and if true the command will exit after the first failed page. 

## Tests
All tests live in the `test` top level directory.

Unit tests live in `test/unit` and are invoked from `test/unit.js`. They use `mocha`.
BDD features live in `test/features` with step definitions in `test/steps` invoked from `test/feature.js`. They use `yadda`.
Maps features live in `test/maps` with step definitions in `test/steps` invoked from `test/maps.js`. They use `yadda`.
Personalisation features live in `test/personalisation` with step definitions in `test/steps` invoked from `test/personlisation.js`. They use `yadda`.
Search features live in `test/search` with step definitions in `test/search-steps` invoked from `test/search.js`. They use `yadda`.

See the *Development debugging* section for more info on environmental commands that effect the execution of tests.

### Docker

The dockerfile can run the tests but there's currently
no development server in `invoke.sh` (should be an easy
fix but docker isn't typically run locally).

There's also a mock ISS server available as `./script/mock-iss`. This will
start a server on `localhost:5000`.

### Adding new icons
Original icons files are stored in a separate repo hosted on GitHub. To add new icons to Ask Izzy they must be added to that repo first then compiled and copied into this repo using the iconify script. 

1) Clone designs repo: `git clone https://github.com/ask-izzy/designs ../ask-izzy-designs`
2) Add desired icons to designs repo and commit
3) Run the iconify script: `./script/iconify ../ask-izzy-designs/icons/*.svg`

The icons/index.js file will be updated, and a new js file for the icon will be generated in /icons.

## Contributing

Link up the git hooks:

    ln -s ../.githooks .git/hooks

Add the git merge strategies to your `.git/config` file:

    [include]
        path = ../.gitmerge/strategies

Check the Linters section for info on how to lint.

Running the tests:
````bash
docker-compose run --rm app unit-test
docker-compose run --rm app feature-test
docker-compose run --rm app personalisation-test
docker-compose run --rm app search-test
# or without docker: 
./script/unit-test
./script/feature-test
./script/personalisation-test
./script/search-test
````

Pass `SELENIUM_BROWSER=firefox|phantomjs|chrome` to choose a
browser to run the feature tests with (default is chrome)

If you have issues running tests on Ubuntu, follow the steps here:
https://christopher.su/2015/selenium-chromedriver-ubuntu/

Then use Chrome as the selenium browser to run the tests.

If you're using a virtual machine open a terminal in the VM to run them.

## Attribution

Bits of the repo setup were based on
https://github.com/gpbl/isomorphic500 @ 413c6533ae23
under the MIT licence
