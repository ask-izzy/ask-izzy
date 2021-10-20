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
        When I click on "Housing"
        Then I should see "I'm looking for help for"

        When I click on the done button

        When I click on "Get your current location"

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "Yes"
        Then I should see "Do you identify as…"

        When I click on the done button # Didn't answer the question
        Then I should see "How old are you?"

        When I click on "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Richmond, VIC | Safe tonight | 18-26"

        When I click back from the title bar
        Then I should be at /

    Scenario: Search for emergency accommodation
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I click on "Housing"
        Then I should see "I'm looking for help for"

        When I click on the done button
        Then I should see "Where are you looking for help?"

        When I click on "Get your current location"

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "No"
        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click on "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Showing housing services"

    Scenario: Do a search
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I search for "find a meal" and press enter
        Then I should see "I'm looking for help for"

        When I click on the done button
        Then I should see "Where are you looking for help?"

        When I click on "Get your current location"

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "Richmond, VIC"

    Scenario: Searching for domestic violence checks that I'm safe
        When I click on "Domestic & family violence help"
        Then I should see "I'm looking for help for"

        When I click on the done button
        Then I should see "Are you safe right now?"

        When I click on "No"
        Then I should see "Everyone has the right to be safe."

        When I click back from the browser UI
        Then I should see "I'm looking for help for"
