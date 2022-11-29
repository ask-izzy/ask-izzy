Feature: Support and counselling personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I am not part of any relevant demographics
        And I am safe at the moment

    Scenario: No subcategory
        Given I am not interested in a subcategory for support-and-counselling
        # Demographic info is cleared when category links on homepage
        # are clicked so we avoid this by navigating to category url directly
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling"
            ],
            "minimumShouldMatch": "1",
            "serviceTypes": [
                "Counselling"
            ]
        }
        --------------------------------------

    Scenario: Mental and emotional health subcategory
        Given I am interested in the "Mental and emotional health" subcategory for support-and-counselling
        When I visit /support-and-counselling
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
                "\"mental health\""
            ],
            "minimumShouldMatch": "30%",
            "showInAskIzzyHealth": true,
            "serviceTypes": [
                "Mental Health"
            ]
        }
        --------------------------------------

    Scenario: Emergency support subcategory
        Given I am interested in the "Emergency support" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling",
                "crisis"
            ],
            "minimumShouldMatch": "1",
            "serviceTypesRaw": [
                "Crisis counselling"
            ]
        }
        --------------------------------------

    Scenario: Family or relationships subcategory
        Given I am interested in the "Family or relationships" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling",
                "family",
                "relationship"
            ],
            "minimumShouldMatch": "1",
            "serviceTypes": [
                "Relationship Assistance"
            ]
        }
        --------------------------------------

    Scenario: Drugs and alcohol counselling subcategory
        Given I am interested in the "Drugs and alcohol counselling" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "drugs",
                "alcohol"
            ],
            "minimumShouldMatch": "30%",
            "serviceTypes": [
                "Alcohol & Other Drug Counselling"
            ]
        }
        --------------------------------------

    Scenario: Gender or sexual identity subcategory
        Given I am interested in the "Gender or sexual identity" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling",
                "sexuality"
            ],
            "minimumShouldMatch": "1"
        }
        --------------------------------------

    Scenario: Homelessness support subcategory
        Given I am interested in the "Homelessness support" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling",
                "housing"
            ],
            "minimumShouldMatch": "1"
        }
        --------------------------------------

    Scenario: Sexual assault or family violence subcategory
        Given I am interested in the "Sexual assault or family violence" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling",
                "family",
                "violence"
            ],
            "minimumShouldMatch": "1",
            "serviceTypes": [
                "Sexual Assault Services",
                "Incest/sexual abuse counselling",
                "Domestic violence counselling"
            ]
        }
        --------------------------------------

    Scenario: Gambling counselling subcategory
        Given I am interested in the "Gambling counselling" subcategory for support-and-counselling
        When I visit /support-and-counselling
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "counselling",
                "gambling"
            ],
            "minimumShouldMatch": "1",
            "serviceTypes": [
                "Gambling Counselling"
            ]
        }
        --------------------------------------
