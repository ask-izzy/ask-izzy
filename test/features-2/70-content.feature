Feature: CMS integration

    # As a user
    # When I visit the homeless-shelters page
    # I want to be able to see the Ask Izzy homeless-shelters page
    Scenario: Display homeless-shelters page
       Given a fresh session
        When I visit /homeless-shelters
        Then I should see "Shelter Services"
        Then I should see "Information about Homeless Shelters."

    # As a user
    # When I visit a page without content
    # I want to be able to see a 404
    Scenario: Display 404 on loading page with no content.
      Given a fresh session
        When I visit /online-safety
        Then I should see "Page not found"

    # As a user
    # When I visit a page with multiple entries
    # I want to be able to see just the first entry
    Scenario: Display only the first page when multiple are returned.
      Given a fresh session
        When I visit /food-info
        Then I should see "Page 1"
        And I should not see "Page 2"

    # As a user
    # When I visit the homeless shelters page
    # I want to see a callout
    Scenario: Display homeless-shelters page with a callout
       Given a fresh session
        When I visit /homeless-shelters
        Then I should see "Ask Izzy can help"

    # As a user
    # When I click on an accordion
    # I want to see it expand and collapse
    Scenario: Display info page with accordion
       Given a fresh session
        When I visit /information
        Then I should see "Victoria"
        Then I should not see "Accordion content for Victoria."
        And I click the "Victoria" collapsible section"
        Then I should see "Accordion content for Victoria."
        And I click the "Victoria" collapsible section"
        Then I should not see "Accordion content for Victoria."

    Scenario: When navigating between pages the correct content is returned.
      Given a fresh session
        When I visit /homeless-shelters
        Then I should see "Information about Homeless Shelters."

        When I visit /terms
        Then I should see "Try to live a good life"

        When I visit /homeless-shelters
        Then I should see "Information about Homeless Shelters."

        When I click the "Terms of use" link
        Then I should see "Try to live a good life"

        When I reload the page
        Then I should see "Try to live a good life"

        When I click the "Shelters" link
        Then I should see "Information about Homeless Shelters."

    Scenario: Display disability organisation page with embedded callout
        Given a fresh session
        When I visit /disability-organisations
        Then I should see "Disability Organisations"
        And I should see "This callout was embedded in the page body"

    Scenario: Display Information page with poorly formatted embedded callout
        Given a fresh session
        When I visit /information
        Then I should see "Information"
        And I should not see "This callout was embedded in the page body"
