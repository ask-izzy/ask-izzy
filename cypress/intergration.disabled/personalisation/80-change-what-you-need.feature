Feature: Change your personalisation settings

    # As a user
    # When I am in the category results
    # I want to change my previously answered personalisation questions
    # So that I can refine my search

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: View personalisation settings and return to search
        When I click the link with "Housing" substring
        And I click the "See all and edit" link
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Where are you looking for help?              | Melbourne, VIC
        How do you identify?                         | Female
        How old are you?                             | 27 to 39
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

        When I click back from the title bar
        Then I should be at /housing/Melbourne-VIC

    Scenario: Edit my location setting
        When I visit /housing/personalise/summary
        And I click the link with "Where are you looking for help?" substring
        Then I should see "Find services near you"

        When I search for "carlt"
        And I click the "Carlton, VIC" dropdown option
        And I click the "Next" button

        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Where are you looking for help?              | Carlton, VIC
        How do you identify?                         | Female
        How old are you?                             | 27 to 39
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit whether I have somewhere to sleep tonight
        When I visit /housing/personalise/summary
        And I click the link with "Do you have somewhere safe to sleep tonight?" substring
        And I click the "No" button
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | No
        Where are you looking for help?              | Melbourne, VIC
        How do you identify?                         | Female
        How old are you?                             | 27 to 39
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
        Do you have somewhere safe to sleep tonight? | Yes
        Where are you looking for help?              | Melbourne, VIC
        How do you identify?                         | Female
        How old are you?                             | 27 to 39
        Do any of these apply to you?                | Aboriginal and/or Torres Strait Islander
        ----------------------------------------------------------------

        When I click the link with "Do any of these apply to you?" substring
        And I click the "Aboriginal and/or Torres Strait Islander" button
        And I click the "Skip" button
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Where are you looking for help?              | Melbourne, VIC
        How do you identify?                         | Female
        How old are you?                             | 27 to 39
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Edit gender
        When I visit /housing/personalise/summary
        And I click the link with "How do you identify?" substring
        And I click the "Male" button
        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Where are you looking for help?              | Melbourne, VIC
        How do you identify?                         | Male
        How old are you?                             | 27 to 39
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

    Scenario: Clear my personalisation
        When I visit /housing/personalise/summary
        And I click the "Clear all answers and restart search" link
        Then I should see the branding header
        And I should be at /
        When I click the link with "Housing" substring

        Then I should see "Do you have somewhere safe to sleep tonight?"
        When I click the "Yes" button

        Then I should see "I'm looking for help for"
        And I click the "Myself" button

        Then I should not see "Melbourne, VIC"
