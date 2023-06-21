
Feature: Question Flow Breadcrumb
  This feature is to include a running feed of the selected questions

    Scenario: Visit a category page for the first time and have my location visible
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        When I visit /
        And I click the link with "Housing" substring
        Then I should see "Do you have somewhere safe to sleep tonight?"
        And I should be at /housing/Melbourne-VIC/personalise/page/sleep-tonight
        And I should see "Melbourne, VIC"

    Scenario: Visit Housing and have your answers follow you to the last question
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        When I visit /
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I click the link with "Housing" substring
        Then I should see "I'm looking for help for"
        And I should be at /housing/Melbourne-VIC/personalise/page/who-is-looking-for-help-housing
        When I click the "Myself" button # Intro
        And I should see "Safe tonight | Melbourne, VIC | Women | 0-17"

    Scenario: Visit Housing and go back to edit your age
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        When I visit /
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I click the link with "Housing" substring
        Then I should see "I'm looking for help for"
        And I should be at /housing/Melbourne-VIC/personalise/page/who-is-looking-for-help-housing
        When I click the "Myself" button
        And I click back from the browser UI
        Then I should see "Melbourne, VIC"

    Scenario: Visit housing and select more than one demographic
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        When I visit /
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        --------------------------------------
        When I click the link with "Housing" substring
        Then I should see "Safe tonight | Melbourne, VIC | Women | 0-17 | Families, Couples"

    Scenario: Visit housing and select more than two demographic and edit
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        When I visit /
        And I have somewhere to sleep tonight
        And I need help for myself
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        Have a disability
        --------------------------------------
        When I click the link with "Housing" substring
        Then I should see "Safe tonight | Melbourne, VIC | Women | 0-17 | Families, Couples …"

        When I click the "See all and edit" link
        And I click the link with "Do any of these apply to you?" substring
        And I should see "Safe tonight | Melbourne, VIC | Women | 0-17 | Families, Couples … (editing)"
        And I click the "Have a disability" button
        And I click the "Done" button # Demographics page
        And I click the "Done" button # Summary page
        Then I should see "Safe tonight | Melbourne, VIC | Women | 0-17 | Families, Couples"

    Scenario: See saved location on the home page
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        When I visit /
        Then I should see "Melbourne, VIC"
        And I should see "Clear saved location"
