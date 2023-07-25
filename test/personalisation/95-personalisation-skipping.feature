Feature: Skip personalisation settings

    # As a user
    # When I visit category results
    # I want to skip over questions I've already answered
    # And have my previous answers saved

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And I am not part of any relevant demographics
        And I visit /

    Scenario: Skip personalisation settings which were already answered
        When I click the link with "Housing" substring
        Then I should see "Which situation is most like yours?"
        When I click the "Skip" button
        Then I should see "I'm looking for help for"
        When I click the "Myself" button # Intro
        Then I should see "Do you identify as…"

        When I click the "Skip" button # Gender
        And I click the "Skip" button  # Age

        And I click the "See all and edit" link
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | (skipped)
        Where are you looking for help?              | Melbourne, VIC
        How do you identify?                         | (skipped)
        How old are you?                             | (skipped)
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------
