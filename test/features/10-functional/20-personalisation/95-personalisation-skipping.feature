Feature: Skip personalisation settings

    # As a user
    # When I visit category results
    # I want to skip over questions I've already answered
    # And have my previous answers saved

    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And I am 27 years old
        And I am not part of any relevant demographics
        And I visit /

    Scenario: Skip personalisation settings which were already answered
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Okay"
        Then I should see "Where are you?"

        When I click on "Done"
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "Skip"
        Then I should see "Which situation is most like yours?"

        When I click on "Skip"
        Then I should see "Do you identify as…"

        # Didn't answer the question
        When I click on "Skip"
        Then I should see "How old are you?"

        When I click on "Skip"
        Then I should see "Do any of these apply to you?"

        When I click on "None of these"
        Then I should see "Housing"

        When I click on "Change your answers"
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you?                               | Melbourne VIC
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | (skipped)
        How do you identify?                         | (skipped)
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------
