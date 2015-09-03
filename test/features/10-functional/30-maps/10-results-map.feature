Feature: See results on a map

    # As a user
    # I want to view category/search results on a map
    # So that I can see where they're located relative to me

    Scenario: View results on a map
        Given my location is "Melbourne VIC"
        When I visit /category/housing

        Given I'm watching map events
        # We can't change URL else we'll remove the maps instrumentation
        When I click on "View on a map"
        Then I should see a map
        # There are 2 sites
        And I should see markers
        --------------------------------------------------
        Title              | Label | Latitude | Longitude
        ==================================================
        Susan's House      | 1     | -37.8237 | 144.985
        My Housing Service | 2     | -37.8228 | 144.998
        --------------------------------------------------

    Scenario: Clicking a marker show services at that site
        Given my location is "Melbourne VIC"
        When I visit /category/housing

        Given I'm watching map events
        # We can't change URL else we'll remove the maps instrumentation
        When I click on "View on a map"
        And I click marker titled "My Housing Service"
        Then I should see the results
        ---------------------
        ServiceName (name)
        =====================
        Housing Service
        Emergency Accom
        ---------------------
