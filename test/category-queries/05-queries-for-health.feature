Feature: Health personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I am not part of any relevant demographics

    Scenario: No subcategory
        Given I am not interested in a subcategory for health
        # Demographic info is cleared when category links on homepage
        # are clicked so we avoid this by navigating to category url directly
        When I visit /health
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "term": [
                "-\"coordinating bodies\"",
                "assistance pets",
                "-\"animal control\"",
                "-effectiveness"
            ],
            "serviceTypes": [
                "Medical",
                "Health Care Services",
                "Health Professionals/ Practitioners"
            ]
        }
        --------------------------------------

    Scenario: Doctor or general practitioner subcategory
        Given I am interested in the "Doctor or general practitioner" subcategory for health
        When I visit /health
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "term": [
                "-\"coordinating bodies\"",
                "\"general medical practitioners\""
            ],
            "serviceTypes": [
                "General Practitioners"
            ]
        }
        --------------------------------------

    Scenario: Mental and emotional health subcategory
        Given I am interested in the "Mental and emotional health" subcategory for health
        When I visit /health
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "term": [
                "-\"coordinating bodies\"",
                "\"mental health\""
            ],
            "serviceTypes": [
                "Mental Health"
            ]
        }
        --------------------------------------

    Scenario: Dentist subcategory
        Given I am interested in the "Dentist" subcategory for health
        When I visit /health
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "term": [
                "-\"coordinating bodies\"",
                "dentistry"
            ],
            "serviceTypes": [
                "Dentists/Oral Health Professionals"
            ]
        }
        --------------------------------------

    Scenario: Children's health subcategory
        Given I am interested in the "Children's health" subcategory for health
        When I visit /health
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "term": [
                "-\"coordinating bodies\"",
                "health",
                "children"
            ],
            "serviceTypes": [
                "Children's health services",
                "Paediatricians & Neonatologists"
            ]
        }
        --------------------------------------

    Scenario: Problems with feet subcategory
        Given I am interested in the "Problems with feet" subcategory for health
        When I visit /health
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "term": [
                "-\"coordinating bodies\"",
                "podiatry"
            ],
            "serviceTypes": [
                "Podiatrists"
            ]
        }
        --------------------------------------

    Scenario: Hospital subcategory
        Given I am interested in the "Hospital" subcategory for health
        When I visit /health
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
                "\"public hospital services\"",
                "-pac",
                "-medicare"
            ],
            "serviceTypes": [
                "Hospital"
            ]
        }
        --------------------------------------

    Scenario: Alcohol and other drugs subcategory
        Given I am interested in the "Alcohol and other drugs" subcategory for health
        When I visit /health
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
                "substance abuse",
                "-\"registered training\"",
                "rehabilitation"
            ],
            "serviceTypes": [
                "Alcohol & Other Drugs"
            ]
        }
        --------------------------------------
