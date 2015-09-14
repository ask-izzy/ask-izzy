Feature: Crisis Line

    # As a user
    # When I select any category
    # I want to see results including the crisis phone numbers
    # So that I can use the number to get help

Scenario: Get helpline phone number for the food category
        Given my location is "Melbourne VIC"
        When I visit /
        And I click on "Food"
        Then I should be at /category/food
        And I should see phone number 0311111111

Scenario: Search for helpline phone numbers for food
        Given my location is "Melbourne VIC"
        When I visit /
        And I search for "food"
        And I click on the search icon
        Then I should be at /search/food
        And I should see phone number 0311111111
