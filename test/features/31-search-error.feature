Feature: Error information

    # As a user
    # When there is a search error
    # I want to see the error message

    Background:
        Given the area to search is "Richmond, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Search error
        When I visit /
        And I search for "elasticsearch unavailable" and press enter
        Then I should see "Sorry, we weren't able to find any services matching your search for “elasticsearch unavailable”."
