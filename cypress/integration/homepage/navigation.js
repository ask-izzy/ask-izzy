import { When } from "cypress-cucumber-preprocessor/steps";

When(`I visit {string}`, (path) => {
    const url = new URL(path, 'http://localhost:8000')
    cy.visit(url.href)
})
