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

        When I click on "Next" # Location

        When I click on "Next"
        Then I should see "Have you been treated badly? Did you have poor service? Do you want to tell someone?"

        When I click on "Do you want someone to speak for you?"
         And I click on "Next"

        Then I should see "What situation do you need help with?"
        When I click back from the title bar

        Then I should see "Have you been treated badly? Did you have poor service? Do you want to tell someone?"
        When I click on "Do you want to make a complaint?"
         And I click on "Next"

        Then I should see "What's not working?"
        When I click on "Public Housing"
         And I click on "Next"

        Then I should see "What situation do you need help with?"
        When I fill in "eviction"
         And I click on "Next"

        Then I should see "I found 1 service for people in Melbourne VIC"
         And I should see "Eviction advocacy Richmond"
