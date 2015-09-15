Feature: Crisis Line

    # As a user
    # When I select any category
    # I want to see results including the crisis phone numbers
    # So that I can use the number to get help


    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing

    Scenario: Get helpline phone number for the food category
        When I visit /
        And I click on "Food"
        Then I should be at /category/food
        And I should see phone number Mobile 0311111111

    Scenario: Search for helpline phone numbers for food
        When I visit /
        And I search for "food"
        And I click on the search icon
        Then I should see phone number Mobile 0311111111
