Feature: Geolocation

    # As a user
    # When I do a search
    # I want to use my current location for searches
    # So that I get personalised results without typing anything

    Scenario: Use geolocation to find the user
        When I visit /personalise/location
        Then I should see "Where are you?"
        And I should see "Get current location"

        Given I'm at 37.823S 144.998E

        When I click on "Get current location"
        Then I should see "Locating you..."

        Then I should see "Found your location"
        And search box should contain "Richmond VIC"

    Scenario: User denies geolocation access
        When I visit /personalise/location

        Given I deny access to geolocation

        When I click on "Get current location"
        Then I should see "Locating you..."
        And I should see "Failed to find your location"
        And I should see "User denied access"
