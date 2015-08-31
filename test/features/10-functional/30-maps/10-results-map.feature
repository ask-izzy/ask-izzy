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
        And I should see 2 markers
        And a marker should have position 37.8237S 144.985E
        And a marker should have position 37.8228S 144.998E
