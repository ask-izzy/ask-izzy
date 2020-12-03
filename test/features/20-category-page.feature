Feature: Category page

    # As a user
    # When I visit a category
    # I want to see relevant results
    # So that I can choose a service

    Background:
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Visit the rent category
        When I visit /rent-and-tenancy
        Then I should see "Rent and tenancy help"
        And I should see the results
        --------------------------------------------------------------------------
        Service Name (name) | Site Name (site_name) | Eligibility (eligibility ul)
        ==========================================================================
        Housing Service     | My Housing Service    | Located in Carlton
        Emergency Accom     | Youth Support Net     | 
        Womens Refuge       | Susan's House         |
        --------------------------------------------------------------------------

        # The rent category has 3 results
        And I should not see "See more results"

    Scenario: Visit a category with more than 5 services
        Given I need the following for food: Finding a free meal nearby
        When I visit /food-and-everyday-things
        Then I should see "See more results"

        When I click on "See more results"
        And I wait for 10 results to load
        Then I should see the results
        --------------------
        Service Name (name)
        ====================
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        --------------------
