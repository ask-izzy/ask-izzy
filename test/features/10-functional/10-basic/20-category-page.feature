Feature: Category page

    # As a user
    # When I visit a category
    # I want to see relevant results
    # So that I can choose a service

    Scenario: Visit housing category
        When I visit /category/housing
        Then I should see "Housing"
        And I should see the results
        -------------------------------------------
        Service Name (name) | Site Name (site_name)
        ===========================================
        Housing Service     | My Housing Service
        Emergency Accom     | Youth Support Net
        Womens Refuge       | Susan's House
        -------------------------------------------
