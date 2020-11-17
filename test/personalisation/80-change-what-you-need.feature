Feature: Change your personalisation settings

    # As a user
    # When I am in the category results
    # I want to change my previously answered personalisation questions
    # So that I can refine my search

    Background:
        Given my location is "Melbourne, Vic"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Edit my location setting
        When I visit /accommodation/personalise/summary
        And I click on "Where are you looking for help?"
        Then I should see "Get your current location"

        When I search for "carlt"
        And I click on "Carlton"
        And I click on the done button

        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        What kind of support do you need?            | Help finding a place to live long term
        Where are you looking for help?              | Carlton, VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit whether I have somewhere to sleep tonight
        When I visit /accommodation/personalise/summary
        And I click on "What kind of support do you need?"
        And I click on "Somewhere to sleep tonight"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        What kind of support do you need?            | Somewhere to sleep tonight
        Where are you looking for help?              | Melbourne, Vic
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit demographics items
        Given I am part of the following demographics
        --------------------------------------
        Aboriginal
        --------------------------------------

        When I visit /accommodation/personalise/summary
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        What kind of support do you need?            | Help finding a place to live long term
        Where are you looking for help?              | Melbourne, Vic
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
        What kind of support do you need?            | Help finding a place to live long term
        Where are you looking for help?              | Melbourne, Vic
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit gender
        When I visit /accommodation/personalise/summary
        And I click on "How do you identify?"
        And I click on "Male"
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        What kind of support do you need?            | Help finding a place to live long term
        Where are you looking for help?              | Melbourne, Vic
        How do you identify?                         | Male
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Clear my personalisation
        When I visit /accommodation/personalise/summary
        And I click on "Delete all answers"

        Then I should see the branding header
        And I should be at /

        When I click on "A place to stay"
        Then I should see "To help me find the right services I'll ask you a few questions"
        And I click on the done button

        Then I should not see "Melbourne, Vic"
