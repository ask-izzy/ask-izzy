Feature: Show location in url

    # As a search engine
    # When I follow a link to Ask Izzy
    # I want to see a helpful page
    # So I know it's a good resource

    Background:
        Given a fresh session

    Scenario: Search via bookmark
        When I visit /search/housing/in/Richmond-Victoria
        Then I should see the following search results "in Richmond, Victoria"
        When I click on "Edit"
        And I click on "Where are you?"
        Then I should see "This will let me find the services closest to you"
        When I search for "carlt"
        And I click on "Carlton"
        And I click on the done button
        And I click on the done button
        Then I should be at /search/housing/Carlton-VIC/
