Feature: Work and learning personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I need help for myself

    Scenario: No subcategory
        Given I am not interested in a subcategory for work-and-learning
        When I click the link with "Work and learning" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "employment",
                "education",
                "-\"coordinating bodies\"",
                "-chsp",
                "-hacc"
            ],
            "serviceTypes": [
                "Employment",
                "Education"
            ]
        }
        --------------------------------------

    Scenario: Finding a job subcategory
        Given I am interested in the "Finding a job" subcategory for work-and-learning
        When I click the link with "Work and learning" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "employment",
                "-\"coordinating bodies\"",
                "-chsp",
                "-hacc",
                "-\"support for business\"",
                "-\"vocation rehabilitation\"",
                "-\"workplace relations\"",
                "jobs"
            ],
            "serviceTypes": [
                "Employment"
            ]
        }
        --------------------------------------

    Scenario: Supported employment subcategory
        Given I am interested in the "Supported employment" subcategory for work-and-learning
        When I click the link with "Work and learning" substring
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
                "job",
                "searching"
            ],
            "serviceTypes": [
                "Employment",
                "Supported Employment"
            ]
        }
        --------------------------------------

    Scenario: Education subcategory
        Given I am interested in the "Education" subcategory for work-and-learning
        When I click the link with "Work and learning" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "education",
                "-\"coordinating bodies\"",
                "-chsp",
                "-hacc"
            ],
            "serviceTypes": [
                "Education"
            ]
        }
        --------------------------------------

    Scenario: Community skills training subcategory
        Given I am interested in the "Community skills training" subcategory for work-and-learning
        When I click the link with "Work and learning" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "education",
                "-\"coordinating bodies\"",
                "-chsp",
                "-hacc",
                "training"
            ],
            "serviceTypes": [
                "Adult and Community Education"
            ]
        }
        --------------------------------------

    Scenario: Volunteering subcategory
        Given I am interested in the "Volunteering" subcategory for work-and-learning
        When I click the link with "Work and learning" substring
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
                "-chsp",
                "-hacc",
                "-grant",
                "volunteer"
            ]
        }
        --------------------------------------

    Scenario: Libraries subcategory
        Given I am interested in the "Libraries" subcategory for work-and-learning
        When I click the link with "Work and learning" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        --------------------------------------
        {
            "location": {
                "name": "Melbourne, VIC"
            },
            "catchment": "prefer",
            "term": [
                "library"
            ],
            "serviceTypes": [
                "Libraries"
            ]
        }
        --------------------------------------
