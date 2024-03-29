Feature: Food personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I am not interested in a subcategory for food

    Scenario: No subcategory
        When I visit /
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
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
            ],
            "serviceTypes": [
                "Food"
            ]
        }
        --------------------------------------

    Scenario: Meals subcategory
        When I visit /
        And I am interested in the "Meals" subcategory for food
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "meals"
            ],
            "serviceTypesRaw": [
                "Meals"
            ]
        }
        --------------------------------------

    Scenario: Food parcels subcategory
        When I visit /
        And I am interested in the "Food parcels / groceries" subcategory for food
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"food parcels\""
            ],
            "serviceTypesRaw": [
                "Food Parcels"
            ]
        }
        --------------------------------------

    Scenario: Food vouchers subcategory
        When I visit /
        And I am interested in the "Food vouchers" subcategory for food
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"food vouchers\""
            ],
            "serviceTypesRaw": [
                "Food Vouchers"
            ]
        }
        --------------------------------------
