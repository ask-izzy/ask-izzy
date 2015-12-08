Feature: Personalisation header

    # As a user
    # When I search for services
    # I want to see a summary of my answers
    # So that I can remember what I searched for

    Background:
        Given a fresh session
        And my location is "Melbourne VIC"

    Scenario: Search for housing
        When I visit /
        And I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Okay" # Intro page
         And I click on "Skip" # Somewhere safe to sleep
         And I click on "Skip" # Subcategories
         And I click on "Neither/Both/Something else"
         And I click on "26 to 39"
         And I click on "None of these" # Demographics
        Then I should see "I found 3 services for people aged 26 to 39 in Melbourne VIC"
