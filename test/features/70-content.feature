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
        When I visit /terms
        Then I should see "Page not found"
