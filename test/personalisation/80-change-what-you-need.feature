Feature: Change your personalisation settings

    # As a user
    # When I am in the category results
    # I want to change my previously answered personalisation questions
    # So that I can refine my search

    Background:
        Given the area to search is "Melbourne, Vic"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: View personalisation settings and return to search
        When I click on "Housing"
        And I click on "See all and edit"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?                               | Melbourne, Vic
        Do you have somewhere safe to sleep tonight? | Yes
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

        When I click back from the title bar
        Then I should be at /housing/Melbourne-Vic/

    Scenario: Edit my location setting
        When I visit /housing/personalise/summary
        And I click on "Where are you looking for help?"
        Then I should see "You don't have to answer, but this helps us give you better results"

        When I search for "carlt"
        And I click on "Carlton"
        And I click on the done button

        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?                               | Carlton, VIC
        Do you have somewhere safe to sleep tonight? | Yes
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit whether I have somewhere to sleep tonight
        When I visit /housing/personalise/summary
        And I click on "Do you have somewhere safe to sleep tonight?"
        And I click on "No"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?                               | Melbourne, Vic
        Do you have somewhere safe to sleep tonight? | No
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit demographics items
        Given I am part of the following demographics
        --------------------------------------
        Aboriginal
        --------------------------------------

        When I visit /housing/personalise/summary
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?                               | Melbourne, Vic
        Do you have somewhere safe to sleep tonight? | Yes
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | Aboriginal and/or Torres Strait Islander
        ----------------------------------------------------------------

        When I click on "Do any of these apply to you?"
        And I click on "Aboriginal and/or Torres Strait Islander"
        And I click on the done button
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?                               | Melbourne, Vic
        Do you have somewhere safe to sleep tonight? | Yes
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit gender
        When I visit /housing/personalise/summary
        And I click on "How do you identify?"
        And I click on "Male"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Where are you looking for help?                               | Melbourne, Vic
        Do you have somewhere safe to sleep tonight? | Yes
        How do you identify?                         | Male
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Clear my personalisation
        When I visit /housing/personalise/summary
        And I click on "Clear all answers and restart search"
        Then I should see the branding header
        And I should be at /
        When I click on "Housing"
        Then I should see "I'm looking for help for"
         And I click on the done button
        Then I should not see "Melbourne, Vic"
