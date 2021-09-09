Feature: Geolocation

    # As a user
    # When I do a search
    # I want to use my current location for searches
    # So that I get personalised results without typing anything

    Scenario: Use geolocation to find the user
        When I visit /
        Given control of geolocation
        When I visit /housing/personalise/page/location
        Then I should see "Where are you looking for help?"
        And I should see "Get your current location"
        And the button "Done" should be disabled

        When I click on "Get your current location"
        Then I should see "Locating you..."

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Done" should be enabled

    Scenario: User denies geolocation access
        When I visit /
        Given control of geolocation
        When I visit /housing/personalise/page/location

        When I click on "Get your current location"
        Then I should see "Locating you..."

        When I deny access to geolocation
        Then I should see "Unable to get your location"
        And I should see "User denied access"
        And the button "Done" should be disabled

    Scenario: User sets their geo-location after setting their location
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory
        When I visit /housing
        Given control of geolocation
        Then I should see "Showing housing services"
        And I should see "Want to see estimated travel times for the services below?"
        When I click on "Get your current location"
        Then I should see "Locating you..."

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location (in Richmond, VIC) – Travel times added below.Clear"
