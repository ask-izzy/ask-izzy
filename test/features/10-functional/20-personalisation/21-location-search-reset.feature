Feature: Location search

    # As a user
    # When I do a search for a bad location
    # I want to be able to change the location
    # So that I can get results

    Background:
        Given a fresh session
        And my location is "Richmond VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Reset bad location
        When I visit /category/housing
        Then I should see "I found 3 housing services for Richmond, VIC."

        When I click on "Change what you need"
        And I click on "Where are you?"
        And I search for "carlt"
        Then I should see "Carlton"
        And I click on "Done"
        Then I should see "carlt"

        When I click on "Okay"
        Then I should see "Sorry, I couldn't do this search."
        And I should see
        ------------------------------------------
        Could not find a location matching "carlt"
        ------------------------------------------
        And I should see "Change what you need"
