Feature: Domestic and family violence help personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I am safe at the moment
        And I am not part of any relevant demographics

    Scenario: No subcategory
        Given I am not interested in a subcategory for dfv-help
        # Demographic info is cleared when category links on homepage
        # are clicked so we avoid this by navigating to category url directly
        When I visit /dfv-help
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"family violence\"",
                "-\"coordinating bodies\"",
                "-\"fire-fighting\""
            ]
        }
        --------------------------------------

    Scenario: Counselling and support subcategory
        Given I am interested in the "Counselling and support" subcategory for dfv-help
        When I visit /dfv-help
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"family violence\"",
                "-\"coordinating bodies\"",
                "-\"fire-fighting\"",
                "counselling"
            ],
            "serviceTypes": [
                "Domestic violence counselling"
            ]
        }
        --------------------------------------

    Scenario: Police subcategory
        Given I am interested in the "Police" subcategory for dfv-help
        When I visit /dfv-help
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
                "-\"fire-fighting\"",
                "police",
                "dvlo"
            ],
            "serviceTypes": [
                "Law enforcement/ Police"
            ]
        }
        --------------------------------------

    Scenario: Legal support subcategory
        Given I am interested in the "Legal support" subcategory for dfv-help
        When I visit /dfv-help
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"family violence\"",
                "-\"coordinating bodies\"",
                "-\"fire-fighting\"",
                "legal",
                "-permits",
                "-ceremonies",
                "-making",
                "-checks",
                "-electoral",
                "-taxation",
                "-centrelink",
                "-immigration",
                "-\"hire of facilities\"",
                "-police"
            ],
            "serviceTypes": [
                "Legal Advice",
                "Legal Aid"
            ]
        }
        --------------------------------------

    Scenario: Children's support and protection subcategory
        Given I am interested in the "Children's support and protection" subcategory for dfv-help
        When I visit /dfv-help
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"family violence\"",
                "-\"coordinating bodies\"",
                "-\"fire-fighting\"",
                "-adoption"
            ],
            "serviceTypesRaw": [
                "Child Protection/ Placement",
                "Child support advice"
            ]
        }
        --------------------------------------

    Scenario: Sexual assault support subcategory
        Given I am interested in the "Sexual assault support" subcategory for dfv-help
        When I visit /dfv-help
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
                "-\"fire-fighting\"",
                "\"sexual assault\""
            ],
            "serviceTypes": [
                "Sexual Assault Services",
                "Incest/sexual abuse counselling"
            ]
        }
        --------------------------------------

    Scenario: Help for people using violence subcategory
        Given I am interested in the "Help for people using violence" subcategory for dfv-help
        When I visit /dfv-help
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
                "-\"fire-fighting\"",
                "\"men's behaviour change\""
            ]
        }
        --------------------------------------

    Scenario: Emergency accommodation subcategory
        Given I am interested in the "Emergency accommodation" subcategory for dfv-help
        When I visit /dfv-help
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"family violence\"",
                "-\"coordinating bodies\"",
                "-\"fire-fighting\"",
                "crisis accommodation"
            ],
            "serviceTypes": [
                "Refuge/ Crisis accommodation",
                "Emergency financial assistance for accommodation"
            ]
        }
        --------------------------------------

    Scenario: Help with pets subcategory
        Given I am interested in the "Help with pets" subcategory for dfv-help
        When I visit /dfv-help
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "\"family violence\"",
                "-\"coordinating bodies\"",
                "-\"fire-fighting\"",
                "pets",
                "-\"animal control\"",
                "-\"effectiveness training\""
            ]
        }
        --------------------------------------
