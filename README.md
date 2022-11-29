# Ask Izzy

Ask Izzy is a website where anyone needing help can quickly and easily find relevant health and welfare services near them. It's built with [Next.js](https://nextjs.org/) and uses [Infoxchange's directory of Australian services](https://www.infoxchange.org/au/products-and-services/service-directory) (commonly referred to as ISS).

## Getting Started

### First Time Setup
Ask Izzy is designed to be run using Docker so that should be [installed](https://docs.docker.com/install/) before continuing (although you may be able to [run it without docker if you prefer](#alternative-dev-process-no-docker)).

To install the required Node.js modules run:
```bash
docker compose run --rm app shell yarn install
```

Environment variables are setup using the standard [Next.js dotenv system](https://nextjs.org/docs/basic-features/environment-variables). There are several required variables which you can set by copying the provided sample files (`cp .env.development.local.sample .env.development.local`), and filling in the values.

## Running Ask Izzy

Once setup you can start it using:
```bash
docker compose up
```

Once started it should be accessible at: http://localhost:8000.

All commands for running tests, linters, etc are managed using run scripts in the [package.json](package.json) file. To make things simple `yarn run` is used as the entrypoint for the docker image meaning that you can easily run any of the in the package.json file with this command: `docker compose run --rm app <package.json run script>`

For example if you want to run all the linters and automaticity fix any issue where possible you would run: `docker compose run --rm app lint-fix`

## Testing
Testing can be run with `docker compose run --rm app test-dev` which will sequentially run all testing programs.

- **Mocha**\
  Currently used for e2e and unit tests. It's split up into 4 testing suites, which can be individually run with `docker-compose run --rm -p 3000:3000 -p 5000:5000 -p 5001:5001 app test-dev-mocha-<test suite name>`
    - **personalisation**\
      For e2e tests related to the personalisation flow in Ask Izzy.
    - **map**\
      e2e tests for the map view are here.
    - **features**\
      Other features are e2e tested here.
    - **unit**\
      All unit tests are here.

## Linting
All linters can be run using `docker compose run --rm app lint`. You can use `lint-fix` instead of `lint` to also try and automatically correct any issues where that is possible. Indvidual linters can be run using: `docker compose run --rm app lint-<linter name>` (if the linter supports it `-fix` can be append to the end of the linter name to auto-fix issues.)

- **ESLint**\
  For JavaScript errors and style violations
- **Flow.js**\
  For static type checking. Most JavaScript in Ask Izzy is written with [Flow.js](https://flow.org/) types with Babel.js used to compile it into plain JavaScript so it can be executed by browsers. This decision was made before it was clear that TypeScript would win the the JavaScript typing wars. At some point we hope to migrate to TypeScript.
- **stylelint**\
  Stylelint is used for linting SASS/CSS files.
- **jsonlint**\
  Shockingly jsonlint is used for linting JSON files.
- **hadolint**\
  hadolint is used for linting the Dockerfile.
- **shellcheck**\
  shellcheck is used for linting any shell scripts.


## Emulating the Production Setup
To make the development process more pleasant the [docker compose.yml](docker compose.yml) file is setup to run code in a dev mode which includes things like live reloading. However it is sometimes desirable to replicate the production setup as close as possible such as to track down a bug only exhibited in production.

First
```bash
cp docker-compose.emulate-production.override.yml.sample docker-compose.emulate-production.override.yml
```

Then edit `docker-compose.emulate-production.override.yml` and fill in the appropriate values.

Once that is setup the emulated prod environment can be spun up with this command:

```bash
docker compose -p ask-izzy-prod -f docker-compose.emulate-production.yml -f docker-compose.emulate-production.override.yml up --build --scale app=2
```

## Alternative Dev Process (No Docker)
Using docker is recommended to ensure a consistent environment. However if desired testing, linting and serving of Ask Izzy can be directly on the host without running in a docker container. To do so a modern version of [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/lang/en/) will need to be installed. Also be aware that [Node modules may need to be re-installed if running into issues](#node-modules-binary-compatibility).

To load the necessary environment variables a .env file can be used. You can copy the sample one with `cp .env.sample .env`. Then any docker run commands like `docker compose run --rm app <remaining command>` can be instead called without using docker by instead using `yarn run <remaining command>`. To replace `docker compose up` use `yarn run dev`.

## Troubleshooting / Gotchas

### Node Modules Binary Compatibility
As docker compose mounts the app source from the host machine into the app source directory (/app) in the docker container, all Node modules that were installed into the node_modules directory at image build time will be mounted over the top of by the host system's node_modules dir (when running locally with docker compose that is). Sometimes this can cause issues since it means the same node_modules directory is used whether a command (like lint) is run directly on the host or inside the docker container. If the host system environment is close enough to the environment of the container (eg some variant of linux) this shouldn't be an issue. However if the host OS is MacOS or Windows then some of the installed node packages may not be compatible with the environment of the host system. In this case you have two options.

  1) (The recommended option.) Ensure the node modules have been installed by running the install command inside the docker container: `docker compose run --rm app shell yarn install`. Then exclusively run all code in docker using `docker compose up` and `docker compose run`.

  2) Avoid using docker entirely, remove the node_module directory, and reinstall the node modules by running the command on the host system (`rm -rf node_modules && yarn install`). Then [avoid using docker and run all code directly on the host](#alternative-dev-process-no-docker).

  ### Adding new icons
Original icons files are stored in a separate repo hosted on GitHub. To add new icons to Ask Izzy they must be added to that repo first then compiled and copied into this repo using the iconify script.

1) Clone designs repo: `git clone https://github.com/ask-izzy/designs ../ask-izzy-designs`
2) Add desired icons to designs repo and commit
3) Run the iconify script: `./scripts/iconify ../ask-izzy-designs/icons/*.svg`

The icons/index.js file will be updated, and a new js file for the icon will be generated in /icons.

