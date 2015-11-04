Feature: See results on a map

    # As a user
    # I want to view category/search results on a map
    # So that I can see where they're located relative to me

    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Bookmark the map page
        When I visit /category/everyday-things/map
        Given I'm watching map events
        Then I should see "To help me find the right services I'll ask you a few questions"
        When I click on "Next"
        When I click on "Next"
        When I click on "Next"
        Then I should see a map

    Scenario: View results on a map
        When I visit /category/housing

        Given I'm watching map events
        # We can't change URL else we'll remove the maps instrumentation
        When I click on "View on a map"
        Then I should see a map
        # There are 2 sites
        And I should see markers
        ------------------------------------------
        Title              | Latitude | Longitude
        ==========================================
        My Housing Service | -37.8228 | 144.998
        Youth Support Net  | -37.8237 | 144.985
        ------------------------------------------

    Scenario: Clicking a marker shows services at that site and clicking on map returns to full map
        When I visit /category/housing

        Given I'm watching map events
        # We can't change URL else we'll remove the maps instrumentation
        When I click on "View on a map"
        And I click marker titled "Youth Support Net"
        Then I should see the results
        ---------------------
        ServiceName (name)
        =====================
        Emergency Accom
        Womens Refuge
        ---------------------

        When I click on the map
        Then I should not see "Housing Service"

    Scenario: Clicking a marker shows services at that site and clicking back returns to full map
        When I visit /category/housing

        Given I'm watching map events
        # We can't change URL else we'll remove the maps instrumentation
        When I click on "View on a map"
        And I click marker titled "My Housing Service"
        Then I should see "Housing Service"

        When I click back from the title bar
        Then I should see a map
        And I should not see "Housing Service"
