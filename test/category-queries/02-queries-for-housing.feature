Feature: Housing personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is omitted
        And I need help for myself
        And I am omitting my age
        And I am not part of any relevant demographics

    Scenario: No subcategory
        Given I am not interested in a subcategory for housing
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "housing",
                "-\"coordinating bodies\"",
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\""
            ],
            "serviceTypes": [
                "Housing"
            ]
        }
        --------------------------------------

    Scenario: Emergency accommodation subcategory in Victoria
        Given I am interested in the "Emergency accommodation" subcategory for housing
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "true",
            "minimumShouldMatch": "30%",
            "term": [
                "-\"coordinating bodies\"",
                "-\"holiday accommodation\"",
                "\"Homelessness Access Point\""
            ],
            "serviceTypes": [
                "Refuge/ Crisis accommodation",
                "Homelessness Access Point"
            ]
        }
        --------------------------------------

    Scenario: Emergency accommodation subcategory outside of Victoria
        Given I am interested in the "Emergency accommodation" subcategory for housing
        Given the area to search is "Adelaide, SA"
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Adelaide, SA"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "term": [
                "-\"coordinating bodies\"",
                "-\"holiday accommodation\""
            ],
            "serviceTypes": [
                "Refuge/ Crisis accommodation"
            ]
        }
        --------------------------------------

    Scenario: Homelessness support subcategory in Victoria
        Given I am interested in the "Homelessness support" subcategory for housing
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "true",
            "minimumShouldMatch": "30%",
            "term": [
                "-\"coordinating bodies\"",
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\"",
                "\"homelessness support\"",
                "\"Homelessness Access Point\""
            ],
            "serviceTypes": [
                "Homelessness Access Point"
            ]
        }
        --------------------------------------

    Scenario: Homelessness support subcategory outside of Victoria
        Given I am interested in the "Homelessness support" subcategory for housing
        Given the area to search is "Adelaide, SA"
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Adelaide, SA"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "term": [
                "-\"coordinating bodies\"",
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\"",
                "\"homelessness support\""
            ],
            "serviceTypes": []
        }
        --------------------------------------

    Scenario: Affordable housing subcategory
        Given I am interested in the "Affordable housing" subcategory for housing
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "term": [
                "housing",
                "-\"coordinating bodies\"",
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\""
            ],
            "serviceTypes": [
                "Housing",
                "Social Housing"
            ]
        }
        --------------------------------------

    Scenario: Bond or rent help subcategory
        Given I am interested in the "Bond or rent help" subcategory for housing
        When I click the link with "Housing" substring
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
                "\"financial aid\"",
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

    Scenario: Rental disputes subcategory
        Given I am interested in the "Rental disputes" subcategory for housing
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "term": [
                "-\"coordinating bodies\"",
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\"",
                "rent",
                "tenant"
            ],
            "serviceTypes": [
                "Housing/Tenancy Information & Referral"
            ]
        }
        --------------------------------------

    Scenario: Support with everyday tasks subcategory
        Given I am interested in the "Support with everyday tasks" subcategory for housing
        When I click the link with "Housing" substring
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
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\"",
                "\"daily living support\""
            ],
            "serviceTypes": [
                "Daily Living Support"
            ]
        }
        --------------------------------------

    Scenario: Supported accommodation subcategory
        Given I am interested in the "Supported accommodation and residential care" subcategory for housing
        When I click the link with "Housing" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "term": [
                "-\"coordinating bodies\"",
                "-\"respite care\"",
                "-\"housing information\"",
                "-hef",
                "-\"holiday accommodation\"",
                "\"supported accommodation\""
            ],
            "serviceTypes": [
                "Supported Accommodation",
                "Supported Residential Accommodation",
                "Supported Residential Accommodation/Aged Care"
            ]
        }
        --------------------------------------
