Feature: Change your personalisation settings

    # As a user
    # When I am in the category results
    # I want to change my previously answered personalisation questions
    # So that I can refine my search

    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing

    Scenario: View personalisation settings and return to search
        When I click on "Housing"
        And I click on "Change what you need"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                  | Answer (secondaryText)
        ================================================================
        Do you have somewhere to sleep tonight? | Yes
        Do you need any of these?               | 0 selected
        Where are you?                          | Melbourne VIC
        ----------------------------------------------------------------

        When I click back from the title bar
        Then I should be at /category/housing

        When I click back from the title bar
        Then I should be at /

    Scenario: Edit my location setting
        When I visit /category/housing/personalise/summary
        And I click on "Where are you?"
        Then I should see "Get current location"

        When I search for "carlt"
        And I click on "Carlton"
        And I click on "Done"

        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                  | Answer (secondaryText)
        ================================================================
        Do you have somewhere to sleep tonight? | Yes
        Do you need any of these?               | 0 selected
        Where are you?                          | Carlton, Victoria
        ----------------------------------------------------------------

    Scenario: Edit whether I have somewhere to sleep tonight
        When I visit /category/housing/personalise/summary
        And I click on "Do you have somewhere to sleep tonight?"
        And I click on "No"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                  | Answer (secondaryText)
        ================================================================
        Do you have somewhere to sleep tonight? | No
        Do you need any of these?               | 0 selected
        Where are you?                          | Melbourne VIC
        ----------------------------------------------------------------
