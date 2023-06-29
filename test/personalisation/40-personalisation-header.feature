Feature: Personalisation header

    # As a user
    # When I search for services
    # I want to see a summary of my answers
    # So that I can remember what I searched for

    Background:
        Given a fresh session
        And the area to search is "Melbourne, VIC"

    Scenario: Search for housing
        When I visit /
        And I click the link with "Housing" substring
        And I am not interested in any subcategory
        And I click the "Skip" button # Somewhere safe to sleep

        Then I should see "I'm looking for help for"
        When I click the "Myself" button # Intro page

        And I click the "Skip" button # Gender

        And I click the "27 to 39" button

        And I click the "Skip" button # Demographics

        Then I should see "Melbourne, VIC | 27-39"
