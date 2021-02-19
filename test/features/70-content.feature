Feature: CMS integration

    # As a user
    # When I visit the about page
    # I want to be able to see the Ask Izzy About page
    Scenario: Display about page
       Given a fresh session
        When I visit /about
        Then I should see "About Ask Izzy"
        Then I should see "We’re always making improvements."

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
    # When I visit a page with content
    # I want to see text in the header bar
    Scenario: Display page with header text
      Given a fresh session
        When I visit /about
        Then I should see "Some primary text"
        And I should see "Some secondary text"

    # As a user
    # When I visit the about page
    # I want to see a collapsed accordion
    Scenario: Display about page with accordion
       Given a fresh session
        When I visit /about
        Then I should see "Victoria"
        Then I should not see "Accordion content for Victoria."

    # As a user
    # When I click on an accordion
    # I want to see it expand and collapse
    Scenario: Display about page with accordion
       Given a fresh session
        When I visit /about
        Then I should see "Victoria"
        Then I should not see "Accordion content for Victoria."
        And I click on an accordion titled "Victoria"
        Then I should see "Accordion content for Victoria."
        And I click on an accordion titled "Victoria"
        Then I should not see "Accordion content for Victoria."

    Scenario: When navigating between pages the correct content is returned.
      Given a fresh session
        When I visit /about
        Then I should see "We’re always making improvements."

        When I visit /terms
        Then I should see "Try to live a good life"

        When I visit /about
        Then I should see "We’re always making improvements."

        When I click on "Terms of use"
        Then I should see "Try to live a good life"

        When I click on "Terms of use"
        Then I should see "Try to live a good life"

        When I reload the page
        Then I should see "Try to live a good life"

        When I click on "About Ask Izzy"
        Then I should see "We’re always making improvements."
