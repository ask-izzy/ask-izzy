Feature: Search personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself

    Scenario: Standard search
        When I visit /
        And I search for "housing help"
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

    Scenario: Disability Advocacy Finder search with specific service type
        When I visit /disability-advocacy-finder
        And I click the "General disability Advocacy" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["General Disability Advocacy"]
        }
        --------------------------------------

    Scenario: Disability Advocacy Finder search for NDIS Appeals
        When I visit /disability-advocacy-finder
        And I click the "Administrative Appeals Tribunal (AAT) - NDIS appeals" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["AAT - NDIS Appeals"]
        }
        --------------------------------------

    Scenario: Disability Advocacy Finder search for Indigenous services
        When I visit /disability-advocacy-finder
        And I click the "Aboriginal & Torres Strait Islander services" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["Aboriginal & Torres Strait Islander services"]
        }
        --------------------------------------

    Scenario: Disability Advocacy Finder search for CALD services
        When I visit /disability-advocacy-finder
        And I click the "Culturally & Linguistically Diverse services (CALD)" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["Culturally & Linguistically Diverse services (CALD)"],
        }
        --------------------------------------
