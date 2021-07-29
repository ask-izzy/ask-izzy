Feature: Personalisation header

    # As a user
    # When I search for services
    # I want to see a summary of my answers
    # So that I can remember what I searched for

    Background:
        Given a fresh session
        And my location is "Melbourne, Vic"

    Scenario: Search for housing
        When I visit /
        And I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions."

        When I click on the done button # Intro page
         And I click on the done button # Somewhere safe to sleep
         And I click on the done button # Gender
         And I click on "27 to 39"
         And I click on the done button # Demographics
        Then I should see "Melbourne, Vic | 27-39"
