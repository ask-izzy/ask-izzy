Feature: Personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is omitted
        And I need help for myself
        And I am omitting my age
        And I am not part of any relevant demographics

    Scenario: Food category with no subcategory
        When I visit /
        And I am not interested in any subcategory
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        Then the iss search request should be:
        --------------------------------------
        {
            "catchment": "prefer",
            "location": {
                "name": "Melbourne, VIC"
            },
            "serviceTypes": [
                "Food"
            ],
            "term": [
                "meals",
                "-\"coordinating bodies\"",
                "-\"home care\"",
                "-\"food safety\"",
                "-\"meals on wheels\"",
                "-\"assistance with meals\"",
                "-\"hire of facilities\"",
                "-chsp",
                "-\"meal preparation\""
            ]
        }
        --------------------------------------

    Scenario: Food category with Meals subcategory
        When I visit /
        And I am interested in the "Meals" subcategory for food
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        Then the iss search request should be:
        --------------------------------------
        {
            "catchment": "prefer",
            "location": {
                "name": "Melbourne, VIC"
            },
            "serviceTypesRaw": [
                "Meals"
            ],
            "term": [
                "meals"
            ]
        }
        --------------------------------------
