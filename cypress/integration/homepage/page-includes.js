import { Then } from "cypress-cucumber-preprocessor/steps";

Then(`I visit {string}`, (path) => {
    const url = new URL(path, 'http://localhost:8000')
    cy.visit(url)
})
