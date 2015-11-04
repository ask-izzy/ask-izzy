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
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Next"
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Automatically detect your location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on "Next"
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "Yes"
        Then I should see "Which situation is most like yours?"

        When I click on "Next"
        Then I should see "Do you identify as…"

        # Didn't answer the question
        When I click on "Next"
        Then I should see "How old are you?"

        When I click on "25 or younger"
        Then I should see "Do any of these apply to you?"

        When I click on "Next"
        Then I should see "Housing"

        When I click back from the title bar
        Then I should see "Do any of these apply to you?"

        When I click back from the title bar
        Then I should see "How old are you?"

        When I click back from the title bar
        Then I should see "Do you identify as…"

        When I click back from the title bar
        Then I should see "Which situation is most like yours?"

        When I click back from the title bar
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click back from the title bar
        Then I should see "Where are you?"

        When I click back from the title bar
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click back from the title bar

         And I click on "Everyday things"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Next"
        Then I should see "Where are you?"

        When I click on "Next"
        Then I should see "What do you need?"

        When I click on "Next"
        Then I should see "I found these services for you"

    Scenario: Search for emergency accommodation
        When I click on "Housing"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Next"
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Automatically detect your location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on "Next"
        Then I should see "Do you have somewhere safe to sleep tonight?"

        When I click on "No"
        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click on "25 or younger"
        Then I should see "Do any of these apply to you?"

        When I click on "Next"
        Then I should see "Housing"

    Scenario: Do a search
        When I search for "find a meal" and press enter
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Next"
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Automatically detect your location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"

        When I click on "Next"
        Then I should see "I found these services for you"
