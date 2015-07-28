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

## Running the dev server

    ./script/dev-server


## Hacking

Link up the git hooks:

    ln -s ../.githooks .git/hooks

Run the linters:

    ./script/typecheck

Running the tests:

    ./script/test

Pass `SELENIUM_BROWSER=...` to choose a browser to test with. Format is
`browser[:version[:platform]]`.
You can pass `SELENIUM_REMOTE_URL` to connect to Selenium Grid.

You can test on Sauce Labs using:

    SELENIUM_REMOTE_URL=ondemand.saucelabs.com:80/wd/hub \
        SAUCE_USERNAME=ask_izzy \
        SAUCE_ACCESS_KEY=... \
        ./script/test

## Attribution

Substantial amounts of the repo setup were based on
https://github.com/gpbl/isomorphic500 @ 413c6533ae23
under the MIT licence
