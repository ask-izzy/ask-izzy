Feature: Skip personalisation settings

    # As a user
    # When I visit category results
    # I want to skip over questions I've already answered
    # And have my previous answers saved

    Background:
        Given the area to search is "Melbourne, Vic"
        And I have somewhere to sleep tonight
        And I am not part of any relevant demographics
        And I visit /

    Scenario: Skip personalisation settings which were already answered
        When I click on "Housing"
        Then I should see "I'm looking for help for"
        When I click on the done button # Intro
        Then I should see "Do you identify as…"

        # Didn't answer the question
        When I click on the done button # Gender
        And I click on the done button  # Age

        And I click on "See all and edit"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?              | Melbourne, Vic
        Do you have somewhere safe to sleep tonight? | Yes
        How do you identify?                         | (skipped)
        How old are you?                             | (skipped)
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------
