Feature: Show location in url

    # As a search engine
    # When I follow a link to Ask Izzy
    # I want to see a helpful page
    # So I know it's a good resource

    Background:
        Given a fresh session

    Scenario: Search via bookmark
        When I visit /search/housing/in/Richmond-Victoria
        Then I should see 3 search results in "Richmond, Victoria"
        When I click on "Edit Answers"
        And I click on "Where are you looking for help?"
        Then I should see "This will help find services closest to your chosen location"
        When I search for "carlt"
        And I click on "Carlton"
        And I click on the done button
        And I click on the done button
        Then I should be at /search/housing/Carlton-VIC/
