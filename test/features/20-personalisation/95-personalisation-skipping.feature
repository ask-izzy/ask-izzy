Feature: Skip personalisation settings

    # As a user
    # When I visit category results
    # I want to skip over questions I've already answered
    # And have my previous answers saved

    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And I am not part of any relevant demographics
        And I visit /

    Scenario: Skip personalisation settings which were already answered
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button # Intro
        And I click on the done button # Age

        When I click on "Change your answers"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you?                               | Melbourne VIC
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | (skipped)
        How old are you?                             | (skipped)
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------
