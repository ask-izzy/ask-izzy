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

    Scenario: Disability Advocacy Finder search with general disability advocacy
        When I visit /disability-advocacy-finder
        And I click the "General disability advocacy" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["advocacy -\"ndis appeals\""],
            "serviceTypesRaw": ["Disability advocacy"],
            "caldSpecific": false,
            "catchment": "true"
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
            "term": ["ndis appeals"],
            "serviceTypesRaw": ["Disability advocacy"],
            "caldSpecific": false,
            "catchment": "true"
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
            "term": ["advocacy indigenous_classification: specific indigenous_classification: cater"],
            "serviceTypesRaw": ["Disability advocacy"],
            "caldSpecific": false,
            "catchment": "true"
        }
        --------------------------------------

    Scenario: Disability Advocacy Finder search for CALD services
        When I visit /disability-advocacy-finder
        And I click the "Culturally & Linguistically Diverse (CALD) services" button
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "term": ["advocacy"],
            "serviceTypesRaw": ["Disability advocacy"],
            "caldSpecific": true,
            "catchment": "true"
        }
        --------------------------------------
