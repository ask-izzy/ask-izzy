Feature: Geolocation

    # As a user
    # When I do a search
    # I want to use my current location for searches
    # So that I get personalised results without typing anything

    Scenario: Use geolocation to find the user
        When I visit /category/housing/personalise/page/location
        Then I should see "Where are you?"
        And I should see "Get your current location"
        And the button "Done" should be disabled

        Given control of geolocation
        When I click on "Get your current location"
        Then I should see "Locating you..."

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, Victoria"
        And the button "Done" should be enabled

    Scenario: User denies geolocation access
        When I visit /category/housing/personalise/page/location

        Given control of geolocation
        When I click on "Get your current location"
        Then I should see "Locating you..."

        When I deny access to geolocation
        Then I should see "Unable to get your location"
        And I should see "Please enter your location below (User denied access)"
        And the button "Done" should be disabled
