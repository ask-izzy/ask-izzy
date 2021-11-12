Feature: Show location in url

    # As a search engine
    # When I follow a link to Ask Izzy
    # I want to see a helpful page
    # So I know it's a good resource

    Background:
        Given a fresh session

    Scenario: Search via bookmark
        When I visit /search/housing/in/Richmond-VIC
        Then I should see "Richmond, VIC"
        When I click the "See all and edit" link
        And I click the link with "Where are you looking for help?" substring
        Then I should see "Find services near you"
        When I search for "carlt"
        And I wait for page to finish loading
        And I click the "Carlton, VIC" dropdown option
        And I click the "Next" button # Location page
        And I click the "Done" button
        Then I should be at /search/housing/Carlton-VIC/
