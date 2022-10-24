import { Then } from "cypress-cucumber-preprocessor/steps";

Then(`I should see the branding header`, () => {
    cy.contains(
        "Find the help you need, now and nearby."
    );
})

Then(`I should see the search bar`, () => {
    cy.get("[data-cy='SearchBar']").should("have.length", 1)
})

Then(`I should see the list of categories:`, (categoryTitles) => {
    console.log(categoryTitles)
})
Then(`I should see the branding footer`, () => {
    cy.contains(
        "About Ask Izzy"
    );
})
