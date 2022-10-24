const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            const cucumber = require("cypress-cucumber-preprocessor").default;
            const browserify = require("@cypress/browserify-preprocessor");
            const options = {
                ...browserify.defaultOptions,
                "nonGlobalStepDefinitions": true,
            };
            on("file:preprocessor", cucumber(options));
            // implement node event listeners here
        },
        specPattern: "**/*.feature",
        supportFile: false,
    },
});
