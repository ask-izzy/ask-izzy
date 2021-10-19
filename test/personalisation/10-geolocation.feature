Feature: Geolocation

    # As a user
    # When I do a search
    # I want to use my current location for searches
    # So that I get personalised results without typing anything

    Scenario: Use geolocation to find the user
        When I visit /
        Given control of geolocation
        And google api geocode will return location name Richmond, VIC
        When I visit /housing/personalise/page/location
        Then I should see "Where are you looking for help?"
        And I should see "Get your current location"
        And the button "Done" should be disabled

        When I click on "Get your current location"
        Then I should see "Locating you..."

        Given my mocked location is 37.823S 144.998E
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

    Scenario: User switches between using geolocate button and manually entering a location
        When I visit /
        Given control of geolocation
        And google api geocode will return location name Richmond, VIC
        When I visit /housing/personalise/page/location
        And I should see "Get your current location"
        And the button "Done" should be disabled

        When I click on "Get your current location"
        Then I should see "Locating you..."

        Given my mocked location is 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Done" should be enabled

        When I search for "carlt"
        Then I should see the results
        -------------------------------------------
        First line (suburb) | Second line (state)
        ===========================================
        Carlton             | VIC
        Carlton North       | VIC
        -------------------------------------------
        And I should see "Get your current location"
        And the button "Done" should be disabled

        When I click on "Carlton"
        Then search box should contain "Carlton, VIC"
        And the button "Done" should be enabled

        When I click on "Get your current location"
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Done" should be enabled

        When I click on "×"
        Then I should see "Get your current location"
        And search box should contain ""
        And the button "Done" should be disabled

        When I reload the page
        Then I should see "Get your current location"
        And search box should contain ""
        And the button "Done" should be disabled

        When I click on "Get your current location"
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Done" should be enabled

        When I reload the page
        Then I should see "Get your current location"
        And search box should contain ""
        And the button "Done" should be disabled

    Scenario: User uses geolocate button on results page after setting their location manually
        Given my location is "Melbourne, VIC"
        And google api geocode will return location name Richmond, VIC
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

        When I visit /housing
        Then I should see "Showing housing services"
        And I should see "Want to see estimated travel times for the services below?"

        Given control of geolocation
        When I click on "Get your current location"
        Then I should see "Locating you..."

        Given my mocked location is 37.823S 144.998E
        Then I should see "Found your location (in Richmond, VIC) – Travel times added below.Clear"

        And I reload the page
        Then I should see "Found your location (in Richmond, VIC) – Travel times added below.Clear"

        When I click on "Clear"
        And I should see "Get your current location"

        Given google api geocode will return location name Melbourne, VIC
        And I reload the page
        Then I should see "Get your current location"

        When I click on "Get your current location"
        Then I should see "Found your location (in Melbourne, VIC) – Travel times added below.Clear"
