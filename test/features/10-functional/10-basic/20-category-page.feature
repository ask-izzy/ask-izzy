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
        --------------------------------------------------------------------------
        Service Name (name) | Site Name (site_name) | Related services (related)
        ==========================================================================
        Housing Service     | My Housing Service    | Transitional Housing Service
        Emergency Accom     | Youth Support Net     | (nada)
        Womens Refuge       | Susan's House         | (nada)
        --------------------------------------------------------------------------

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

    Scenario: A service with 5 related services only shows 4
        Given my location is "Melbourne VIC"
        When I visit /category/food

        Then I should see "Material Aid"
        And I should see "Community Outreach"
        And I should see "Crisis Accommodation"
        And I should see "Centrelink Services"
        And I should not see "Drug & Alcohol Counselling"

    Scenario: I should never see "invalid date"
        Given my location is "Melbourne VIC"
        When I visit /category/housing
        Then I should not see "Invalid date"

    # FIXME: how do we mock time?
    # Scenario: Can show opening time tomorrow
        # Given my location is "Melbourne VIC"
        # And today is a Tuesday
        # When I visit /category/food
        # Then I should see "Closed until tomorrow 9:00 AM"

    # Scenario: Can show opening time 2 days hence
        # Given my location is "Melbourne VIC"
        # And today is a Monday
        # When I visit /category/food
        # Then I should see "Closed until Wednesday 9:00 AM"
