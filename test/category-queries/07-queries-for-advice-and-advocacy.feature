Feature: Advice and advocacy personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I am not part of any relevant demographics
        And I need help for myself
        

    Scenario: No subcategory
        When I visit /
        And I am not interested in any subcategory
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "advice",
                "advocacy",
                "-research",
                "-\"coordinating bodies\""
            ],
            "serviceTypes": [
                "Advocacy",
                "Law"
            ]
        }
        --------------------------------------

    Scenario: Legal aid and advice subcategory
        When I visit /
        And I am interested in the "Legal aid and advice" subcategory for advice-and-advocacy
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "advice",
                "-\"coordinating bodies\"",
                "legal",
                "-permits",
                "-ceremonies"
            ],
            "serviceTypes": [
                "Legal Advice",
                "Legal Aid",
                "Legal Information",
                "Legal Representation"
            ]
        }
        --------------------------------------

    Scenario: Help with fines subcategory
        When I visit /
        And I am interested in the "Help with fines" subcategory for advice-and-advocacy
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "-research",
                "-\"coordinating bodies\"",
                "fines",
                "-CAYPINS",
                "-\"court fund\"",
                "-training",
                "-\"allied health\"",
                "-art",
                "-dentist",
                "-alcohol"
            ]
        }
        --------------------------------------

    Scenario: Advocacy subcategory
        When I visit /
        And I am interested in the "Advocacy" subcategory for advice-and-advocacy
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "advocacy",
                "-research",
                "-\"coordinating bodies\"",
                "-\"disability advocacy\""
            ],
            "serviceTypes": [
                "Advocacy"
            ]
        }
        --------------------------------------

    Scenario: Disability advocacy subcategory
        When I visit /
        And I am interested in the "Disability advocacy" subcategory for advice-and-advocacy
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "disability"
            ],
            "serviceTypesRaw": [
                "Disability advocacy"
            ]
        }
        --------------------------------------

    Scenario: Homelessness support subcategory
        When I visit /
        And I am interested in the "Homelessness support" subcategory for advice-and-advocacy
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "advocacy",
                "-research",
                "-\"coordinating bodies\"",
                "homelessness"
            ],
            "serviceTypes": [
                "Advocacy"
            ]
        }
        --------------------------------------

    Scenario: Rental disputes subcategory
        When I visit /
        And I am interested in the "Rental disputes" subcategory for advice-and-advocacy
        When I click the link with "Advice and advocacy" substring
        # On the advice and advocacy category page, the demographics personalisation question
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
                "rent",
                "tenant",
                "-\"respite care\"",
                "-hef",
                "-\"holiday accommodation\""

            ],
            "serviceTypes": [
                "Housing/Tenancy Information & Referral"
            ]
        }
        --------------------------------------
