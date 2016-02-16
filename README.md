# Ask Izzy

## Dependencies

If you're working on this codebase, some understanding of the following will
help:

 * Node/npm
 * webpack
 * React
 * jsx (inline templating)
 * babel (es6 transpiler)
 * [flow typesystem](http://flowtype.org)
 * mocha (unit testing)
 * yadda (BDD testing)

## Getting the code

    git clone git@github.com:ask-izzy/ask-izzy.git
    cd ask-izzy
    npm install
    bower install

## Running the dev server

You will need API keys for [ISS](https://api.serviceseeker.com.au/) and
Google.

    ISS_URL=... GOOGLE_API_KEY=... ./script/dev-server

### Forklift

If you're using [forklift](https://github.com/infoxchange/docker-forklift)
then you can add a config file `~/.config/forklift/ask-izzy.yaml`:

    environment:
        ISS_URL: ...
        # ISS_URL: http://localhost:5000
        GOOGLE_API_KEY: ...

And run:

    forklift -- ./script/dev-server

There's also a mock ISS server available as `./script/mock-iss`. This will
start a server on `localhost:5000`.


## Contributing

Link up the git hooks:

    ln -s ../.githooks .git/hooks

Add the git merge strategies to `.git/config`:

    [include]
        path = ../.gitmerge/strategies

Run the linters:

    ./script/typecheck

Running the tests:

    forklift -- ./script/unit-test
    forklift -- ./script/feature-test
    forklift -- ./script/search-test

Pass `SELENIUM_BROWSER=...` to choose a browser to test with. Format
is `browser[:version[:platform]]`, `browser` might be 'phantomjs',
'firefox', etc.

You can pass `BROWSER_LOGS=yes` to dump logs from the browser. Be aware not
all browsers support this.

## Attribution

Bits of the repo setup were based on
https://github.com/gpbl/isomorphic500 @ 413c6533ae23
under the MIT licence
