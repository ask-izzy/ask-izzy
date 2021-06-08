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
        Given control of geolocation
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on the done button
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on option "Yes"
        Then I should see "Do you identify as…"

        When I click on the done button # Didn't answer the question
        Then I should see "How old are you?"

        When I click on option "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Richmond, Victoria | Safe tonight | 18-26"

        When I click back from the title bar
        Then I should be at /

    Scenario: Search for emergency accommodation
        Given control of geolocation
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Where are you?"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on the done button
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on option "No"
        Then I should see "Do you identify as…"

        When I click on option "Female"
        Then I should see "How old are you?"

        When I click on option "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Showing housing services"

    Scenario: Do a search
        Given control of geolocation
        When I search for "find a meal" and press enter
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Where are you?"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on the done button
        Then I should see "Richmond, Victoria"

    Scenario: Searching for domestic violence checks that I'm safe
        When I click on "Domestic & family violence help"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Are you safe right now?"

        When I click on option "No"
        Then I should see "Everyone has the right to be safe"

        When I click back from the title bar
        Then I should see "Intro"
