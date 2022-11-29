Feature: Search personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself

    Scenario: Standard search
        When I search for "housing help"
        And I click the "Search" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["housing help"]
        }
        --------------------------------------

    Scenario: Disability Advocacy Finder search with search term
        When I visit /disability-advocacy-finder
        When I search for "food help"
        And I click the "Search" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["food help"],
            "serviceTypesRaw": ["disability advocacy"]
        }
        --------------------------------------

    Scenario: Disability Advocacy Finder search without search term
        When I visit /disability-advocacy-finder
        When I click the link with "Browse all disability advocacy services" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["disability"],
            "serviceTypesRaw": ["disability advocacy"]
        }
        --------------------------------------
