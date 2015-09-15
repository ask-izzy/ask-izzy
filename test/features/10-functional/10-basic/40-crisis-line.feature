Feature: Crisis Line

    # As a user
    # When I select any category
    # I want to see results including the crisis phone numbers
    # So that I can use the number to get help


    Background:
        Given my location is "Melbourne VIC"
        And my gender is female
        And I am not part of any relevant demographics

    Scenario: Get helpline phone number for the food category
        When I visit /
        And I click on "Food"
        Then I should be at /category/food
        And I should see a hotline in position 2 which says Mobile 0311111111

    Scenario: Search for helpline phone numbers for domestic violence
        When I visit /
        And I search for "domestic violence"
        And I click on the search icon
        Then I should see a hotline in position 2 which says Mobile 0311111111
