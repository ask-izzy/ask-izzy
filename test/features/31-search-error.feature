Feature: Error information

    # As a user
    # When there is a search error
    # I want to see the error message

    Background:
        Given my location is "Richmond, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Search error
        When I search for "elasticsearch unavailable" and press enter
        Then I should see "Sorry, I couldn't do this search."
        And I should see "An error occurred. Please try again."
        And I should see "Go back"
        And I should see "See all and edit"
