Feature: Everyday needs personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself

    Scenario: No subcategory
        Given I am not interested in a subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "material",
                "aid",
                "-\"coordinating bodies\""
            ],
            "serviceTypes": ["Material Aid"]
        }
        --------------------------------------

    Scenario: Clothes and household goods subcategory
        Given I am interested in the "Clothes and household goods" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "material",
                "aid",
                "-\"coordinating bodies\"",
                "\"household goods\"",
                "clothes"
            ],
            "serviceTypes": [
                "Material Aid",
                "Clothing",
                "Household goods and furniture"
            ]
        }
        --------------------------------------

    Scenario: Transport subcategory
        Given I am interested in the "Transport" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
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
                "transport",
                "travel",
                "-hacc"
            ],
            "serviceTypes": [
                "Community Transport"
            ]
        }
        --------------------------------------

    Scenario: Keeping warm subcategory
        Given I am interested in the "Keeping warm" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
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
                "swags",
                "blankets"
            ],
            "serviceTypes": [
                "Swags/Blankets"
            ]
        }
        --------------------------------------

    Scenario: Technology subcategory
        Given I am interested in the "Technology" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
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
                "wifi",
                "internet",
                "computer"
            ],
            "serviceTypes": [
                "Internet Kiosks",
                "Libraries"
            ]
        }
        --------------------------------------

    Scenario: Showers and laundry subcategory
        Given I am interested in the "Showers and laundry" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "material",
                "aid",
                "-\"coordinating bodies\"",
                "laundry",
                "facilities",
                "washing",
                "drying",
                "showers"
            ],
            "serviceTypes": [
                "Showers",
                "Laundry Facilities"
            ]
        }
        --------------------------------------

    Scenario: Personal products subcategory
        Given I am interested in the "Personal products" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "material",
                "aid",
                "-\"coordinating bodies\"",
                "toiletries",
                "sanitary",
                "products",
                "tampons"
            ],
            "serviceTypes": [
                "Toiletries"
            ]
        }
        --------------------------------------

    Scenario: Toilets subcategory
        Given I am interested in the "Toilets" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
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
                "\"public facilities\"",
                "-\"hire of facilities\"",
                "-maintenance"
            ],
            "serviceTypes": [
                "Public Toilets"
            ]
        }
        --------------------------------------

    Scenario: Support with everyday tasks subcategory
        Given I am interested in the "Support with everyday tasks" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
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
                "daily living support",
                "-\"respite care\"",
                "-hef",
                "-\"holiday accommodation\""
            ],
            "serviceTypes": [
                "Daily Living Support"
            ]
        }
        --------------------------------------

    Scenario: Help with pets subcategory
        Given I am interested in the "Help with pets" subcategory for everyday-needs
        When I click the link with "Everyday needs" substring
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
                "assistance pets",
                "-\"animal control\"",
                "-effectiveness"
            ]
        }
        --------------------------------------
