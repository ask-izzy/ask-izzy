Feature: Personalisation

    # As a user
    # When I do a search
    # I want to answer personalisation questions around my demographics
    # and needs; and have my results personalised with my current location
    # So that I get personalised results

    Background:
        Given a fresh session
        And I visit /

    @skipphantomjs
    Scenario: Search for housing with personalised results
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on the done button
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "Yes"
        Then I should see "Which situation is most like yours?"

        When I click on the done button
        Then I should see "How old are you?"

        When I click on "25 or younger"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see 3 search results for "people aged 25 or younger" in "Richmond, Victoria"

        When I click back from the title bar
        Then I should see "The A to Z directory of homeless help"

    @skipphantomjs
    Scenario: Search for emergency accommodation
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on the done button
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "No"
        Then I should see "How old are you?"

        When I click on "25 or younger"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "Housing"

    @skipphantomjs
    Scenario: Do a search
        When I search for "find a meal" and press enter
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on the done button
        Then I should see 3 search results in "Richmond, Victoria"
