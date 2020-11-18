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
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "What kind of support do you need?"

        When I click on "Help finding a place to live long term"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "What gender do you identify most closely with?"

        When I click on the done button # Didn't answer the question
        Then I should see "How old are you?"

        When I click on "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button        
        And I visit /accommodation/personalise/summary

        Then I should see "Change your answers here"
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        What kind of support do you need?            | Help finding a place to live long term
        Where are you looking for help?              | Richmond, VIC
        How do you identify?                         | (skipped)
        How old are you?                             | 18 to 26
        Do any of these apply to you?                | None selected
        ----------------------------------------------------------------

        When I click back from the title bar
        Then I should be at /accommodation/Richmond-VIC/

    Scenario: Search for emergency accommodation
        Given control of geolocation
        When I click on "A place to stay"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "What kind of support do you need?"

        When I click on "Somewhere to sleep tonight"
        Then I should see "Where are you looking for help?"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"

        When I click on the done button
        Then I should see "What gender do you identify most closely with?"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click on "18 to 26"
        Then I should see "Do any of these apply to you?"

        When I click on the done button
        Then I should see "A place to stay"

    Scenario: Do a search
        Given control of geolocation
        When I search for "find a meal" and press enter
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on the done button
        Then I should see "Where are you looking for help?"

        When I click on "Get your current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
