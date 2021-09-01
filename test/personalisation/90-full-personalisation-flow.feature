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
        When I click on "A place to stay"
        Then I should see "I'm looking for help for"

        When I click on the done button

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "Do you identify as…"

        When I click on the done button # Didn't answer the question
        Then I should see "How old are you?"

        When I click on "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Richmond, VIC | 18-26"

        When I click back from the title bar
        Then I should be at /

    Scenario: Search for emergency accommodation
        Given control of geolocation
        When I click on "A place to stay"
        Then I should see "I'm looking for help for"

        When I click on the done button
        Then I should see "Where are you looking for help?"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click on "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Showing a place to stay services"

    Scenario: Do a search
        Given control of geolocation
        When I search for "find a meal" and press enter
        Then I should see "I'm looking for help for"

        When I click on the done button
        Then I should see "Where are you looking for help?"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "Richmond, VIC"
