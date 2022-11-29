Feature: Personalisation flow generates the expected query

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is omitted
        And I need help for myself
        And I am omitting my age
        And I am not part of any relevant demographics

    Scenario: Food category with no subcategory
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        {
            "area": "3000, VIC",
            "catchment": "prefer",
            "q": "meals -(coordinating bodies) -(home care) -(food safety) -(meals on wheels) -(assistance with meals) -(hire of facilities) -chsp -(meal preparation),
            "service_type": [
                "Food"
            ]
        }

    Scenario: Food category with Meals subcategory
        Given the area to search is "Melbourne, VIC"
        When I click the link with "Food" substring
        Then I should see "See all and edit"
        And the iss search request should be:
        {
            "area": "3000, VIC",
            "catchment": "prefer",
            "q": "meals -(coordinating bodies) -(home care) -(food safety) -(meals on wheels) -(assistance with meals) -(hire of facilities) -chsp -(meal preparation),
            "service_type": [
                "Food"
            ]
        }
