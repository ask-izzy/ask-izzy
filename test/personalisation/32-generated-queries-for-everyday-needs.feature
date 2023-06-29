Feature: Everyday needs personalisation flow generates the expected query
    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And I am not interested in any subcategory
        And my gender is omitted
        And I need help for myself
        And I am omitting my age
        And I am not part of any relevant demographics

    Scenario: No subcategory
        When I visit /
        And I am not interested in a subcategory for everyday-needs
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
        When I visit /
        And I am interested in the "Clothes and household goods" subcategory for housing
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
            "serviceTypes": [
                "Material Aid"
            ]
        }
        --------------------------------------
