Feature: Personalisation

    # As a user
    # When I do a search
    # I want to answer personalisation questions around my demographics
    # and needs; and have my results personalised with my current location
    # So that I get personalised results

    Background:
        Given a fresh session
        And I visit /

    Scenario: Search for housing with personalised results
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I click the link with "Housing" substring
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click the "Yes" button
        Then I should see "I'm looking for help for"

        When I click the "Myself" button

        When I click the "Get your current location" button

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click the "Next" button
        Then I should see "Do you identify as…"

        When I click the "Skip" button
        Then I should see "How old are you?"

        When I click the "18 to 26" button
        Then I should see "Do any of these apply to you?"

        When I click the "Skip" button
        Then I should see "Safe tonight | Richmond, VIC | 18-26"

        When I click back from the title bar
        Then I should be at /

    Scenario: Search for emergency accommodation
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I click the link with "Housing" substring
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click the "No" button
        Then I should see "I'm looking for help for"

        When I click the "Myself" button
        Then I should see "Where are you looking for help?"

        When I click the "Get your current location" button

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click the "Next" button
        Then I should see "Do you identify as…"

        When I click the "Female" button
        Then I should see "How old are you?"

        When I click the "18 to 26" button
        Then I should see "Do any of these apply to you?"

        When I click the "Skip" button
        Then I should see "Showing housing services"

    Scenario: Do a search
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I search for "find a meal" and press enter
        Then I should see "I'm looking for help for"

        When I click the "Myself" button
        Then I should see "Where are you looking for help?"

        When I click the "Get your current location" button

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click the "Next" button
        Then I should see "Richmond, VIC"

    Scenario: Searching for domestic violence checks that I'm safe
        When I click the link with "Domestic & family violence help" substring
        Then I should see "Are you safe right now?"

        When I click the "No" button
        Then I should see "Everyone has the right to be safe."

        When I click back from the browser UI
        Then I should see "Are you safe right now?"
