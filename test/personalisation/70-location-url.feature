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
        When I click on "See all and edit"
        And I click on "Where are you looking for help?"
        Then I should see "You don't have to answer, but this helps us give you better results"
        When I search for "carlt"
        And I click on "Carlton"
        And I click on the done button
        And I click on the done button
        Then I should be at /search/housing/Carlton-VIC/
