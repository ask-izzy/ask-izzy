Feature: Support and counselling personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I am not part of any relevant demographics
        And I am safe at the moment

    Scenario: No subcategory
        When I visit /
        And I am not interested in a subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
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
        When I visit /
        And I am interested in the "Mental and emotional health" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Do any of these apply to you?"
        When I click the "Skip" button
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
            "serviceTypesRaw": [
                "Mental Health"
            ]
        }
        --------------------------------------

    Scenario: Emergency support subcategory
        When I visit /
        And I am interested in the "Emergency support" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Emergency support subcategory subcategory page, the are you safe question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Are you safe right now?"
        When I click the "Skip" button
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Would you like Aboriginal & Torres Strait Islander specific services?"
        When I click the "Skip" button
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
        When I visit /
        And I am interested in the "Family or relationships" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Family or relationships subcategory subcategory subcategory page, the are you safe question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Are you safe right now?"
        When I click the "Skip" button
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Do any of these apply to you?"
        When I click the "Skip" button
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
        When I visit /
        And I am interested in the "Drugs and alcohol counselling" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Do any of these apply to you?"
        When I click the "Skip" button
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
                "Counselling"
            ],
            "serviceTypesRaw": [
                "Alcohol & Other Drug Counselling"
            ]
        }
        --------------------------------------

    Scenario: Gender or sexual identity subcategory
        When I visit /
        And I am interested in the "Gender or sexual identity" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Would you like Aboriginal & Torres Strait Islander specific services?"
        When I click the "Skip" button
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
        When I visit /
        And I am interested in the "Homelessness support" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Would you like Aboriginal & Torres Strait Islander specific services?"
        When I click the "Skip" button
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
                "-hef -\"holiday accommodation\"",
                "\"homelessness support\"",
            ]
        }
        --------------------------------------

    Scenario: Sexual assault or family violence subcategory
        When I visit /
        And I am interested in the "Sexual assault or family violence" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Sexual assault or family violence subcategory subcategory subcategory subcategory page, the are you safe question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Are you safe right now?"
        When I click the "Skip" button
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Would you like Aboriginal & Torres Strait Islander specific services?"
        When I click the "Skip" button
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
            "serviceTypesRaw": [
                "Incest/sexual abuse counselling",
                "Domestic violence counselling"
            ]
        }
        --------------------------------------

    Scenario: Gambling counselling subcategory
        When I visit /
        And I am interested in the "Gambling counselling" subcategory for support-and-counselling
        When I click the link with "Support and counselling" substring
        # On the Support and counselling category page, the demographics personalisation question
        # is always asked regardless of whether the user has already answered it
        Then I should see "Do any of these apply to you?"
        When I click the "Skip" button
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
