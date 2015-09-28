Feature: Personalisation

    # As a user
    # When I do a search
    # I want to answer personalisation questions around my demographics
    # and needs; and have my results personalised with my current location
    # So that I get personalised results

    Background:
        Given a fresh session

    Scenario: Search for housing with personalised results
        When I visit /
        And I click on "Housing"
        Then I should see "These services can help you find a place to stay."

        When I click on "Okay"
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "Yes"
        Then I should see "Do you need any of these?"

        When I click on "Done"
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Get current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on "Done"
        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click on "25 or younger"
        Then I should see "Do any of these apply to you?"

        When I click on "Done"
        Then I should see "Housing"

    Scenario: Search for emergency accommodation
        When I visit /
        And I click on "Housing"
        Then I should see "These services can help you find a place to stay."

        When I click on "Okay"
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "No"
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Get current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on "Done"
        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click on "25 or younger"
        Then I should see "Do any of these apply to you?"

        When I click on "Done"
        Then I should see "Housing"
