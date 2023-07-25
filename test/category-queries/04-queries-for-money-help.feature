Feature: Money help personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself

    Scenario: No subcategory
        When I visit /
        And I am not interested in a subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "financial",
                "aid",
                "-\"coordinating bodies\"",
                "-grants",
                "-heritage"
            ],
            "serviceTypes": [
                "Finance",
                "Financial Aid"
            ]
        }
        --------------------------------------

    Scenario: Centrelink subcategory
        When I visit /
        And I am interested in the "Centrelink" subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "centrelink"
            ],
            "serviceTypes": [
                "Centrelink"
            ],
            "name": "centrelink"
        }
        --------------------------------------

    Scenario: Financial aid subcategory
        When I visit /
        And I am interested in the "Financial aid" subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "financial",
                "-\"coordinating bodies\"",
                "-grants",
                "-heritage",
                "\"Emergency Relief\"",
                "disadvantage"
            ],
            "isBulkBilling": false,
            "serviceTypesRaw": [
                "Financial Aid"
            ]
        }
        --------------------------------------

    Scenario: No or low interest loans subcategory
        When I visit /
        And I am interested in the "No or low interest loans" subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "-\"coordinating bodies\"",
                "-grants",
                "-heritage",
                "nils",
                "low-interest"
            ],
            "serviceTypes": [
                "Low-interest loans",
                "NILS"
            ]
        }
        --------------------------------------

    Scenario: Financial counselling subcategory
        When I visit /
        And I am interested in the "Financial counselling" subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "financial",
                "-\"coordinating bodies\"",
                "-grants",
                "-heritage",
                "counselling"
            ],
            "serviceTypes": [
                "Financial Counselling"
            ]
        }
        --------------------------------------

    Scenario: Bond or rental assistance subcategory
        When I visit /
        And I am interested in the "Bond or rental assistance" subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "financial",
                "aid",
                "-\"coordinating bodies\"",
                "-grants",
                "-heritage",
                "\"bond assistance\""
            ],
            "serviceTypes": [
                "Bond Scheme",
                "Housing Establishment Fund"
            ]
        }
        --------------------------------------

    Scenario: Gambling counselling subcategory
        When I visit /
        And I am interested in the "Gambling counselling" subcategory for money-help
        When I click the link with "Money help" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "-\"coordinating bodies\"",
                "-grants",
                "-heritage",
                "gambling",
                "counselling"
            ],
            "serviceTypes": [
                "Gambling Counselling"
            ]
        }
        --------------------------------------
