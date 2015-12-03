Feature: Advocacy Personalisation

    # As a user
    # When I search for advocacy
    # I want to answer questions about my needs
    # So that my results are personalised with my answers

    Background:
        Given a fresh session
        And my location is "Melbourne VIC"

    Scenario: Search for advocacy with personalised results
        When I visit /
        And I click on "Have your say"
        Then I should see "To help me find the right services I'll ask you a few questions"

        When I click on "Okay" # Intro
         And I click on "Done" # Location

        Then I should see "What do you want to do help with or advice about?"

        When I click on "Making a complaint"
         And I click on "Someone to speak for you"
         And I click on "Done"

        Then I should see "What's not working?"

        When I click on "Public Housing"
         And I click on "Done"

        Then I should see "I found 1 service in Melbourne VIC"
         And I should see "Eviction advocacy Richmond"
