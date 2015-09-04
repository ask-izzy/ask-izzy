Feature: Change your personalisation settings

    # As a user
    # When I am in the category results
    # I want to change my previously answered personalisation questions
    # So that I can refine my search

    Scenario: View personalisation settings and return to search
        Given my location is "Melbourne VIC"
        When I click on "Housing"
        And I click on "Change what you need"
        Then I should see the results
        ------------------------------------------------
        Question (primaryText) | Answer (secondaryText)
        ================================================
        Where are you?         | Melbourne VIC
        ------------------------------------------------

        When I click back from the title bar
        Then I should be at /category/housing

        When I click back from the title bar
        Then I should be at /
