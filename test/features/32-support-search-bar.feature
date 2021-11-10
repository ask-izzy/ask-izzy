Feature: Search bar in subcategories page

    # As a user
    # When I click on food and see subcategories
    # I don't see what I am looking for

    Scenario: Navigate via category to a service and search for another service
        Given a fresh session
        And the area to search is "Melbourne, VIC"

        When I visit /
        And I click on "Food"

        Then I should see "I'm looking for help for"
        And I should be at /food/personalise

        When I click on the done button # Intro

        Then I should see "What type of food do you need?"
        And I should see the search bar
        
        When I search for "pet food"
        And I click on the search button
        Then I should be at /search/pet food
