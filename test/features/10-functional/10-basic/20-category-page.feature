Feature: Category page

    # As a user
    # When I visit a category
    # I want to see relevant results
    # So that I can choose a service

    Scenario: Visit housing category
        Given my location is "Melbourne VIC"
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

        And I should see an info box in position 2
        And the info box should contain
        ---------------------------------------------------------------------
        It's important to act early on housing. These services can help to find a place to stay, or rental assistance to help you stay in your current house.
        Find out more
        HOUSING INFORMATION
        ---------------------------------------------------------------------

    Scenario: Navigate to a service and back to a category
        Given my location is "Melbourne VIC"
        When I visit /category/housing
        And I click on "Housing Service"
        Then I should see "A housing service for people."

        When I click back from the title bar
        Then I should see "Emergency Accom"
        And I should be at /category/housing
