Feature: Geolocation

    # As a user
    # When I do a search
    # I want to use my current location for searches
    # So that I get personalised results without typing anything

    Scenario: Use geolocation to find the user
        When I visit /
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I visit /housing/personalise/page/location
        Then I should see "Where are you looking for help?"
        When I search for blank
        And I should see "Get your location"
        And the button "Next" should be disabled

        When I search for blank
        When I click the "Get your location" button
        Then I should see "Locating you..."

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Next" should be enabled

    Scenario: User denies geolocation access
        When I visit /
        Given GPS will hang in the loading state
        When I visit /housing/personalise/page/location

        When I search for blank
        When I click the "Get your location" button
        Then I should see "Locating you..."

        When I deny access to geolocation
        Then I should see "Unable to get your location"
        And I should see "User denied access"
        And the button "Next" should be disabled

    Scenario: User switches between using geolocate button and manually entering a location
        When I visit /
        Given GPS will hang in the loading state
        And google api geocode will return location name Richmond, VIC
        When I visit /housing/personalise/page/location
        When I search for blank
        And I should see "Get your location"
        And the button "Next" should be disabled

        When I search for blank
        When I click the "Get your location" button
        Then I should see "Locating you..."

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Next" should be enabled

        When I search for "carlt"
        And I wait for page to finish loading
        Then I should see the results
        -------------------------------------------
        First line (suburb) | Second line (state)
        ===========================================
        Carlton             | VIC
        Carlton North       | VIC
        -------------------------------------------
        And the button "Next" should be disabled

        When I show the mouse cursor
        When I click the "Carlton, VIC" dropdown option
        Then search box should contain "Carlton, VIC"
        And the button "Next" should be enabled

        When I click the "×" button
        When I search for blank
        When I click the "Get your location" button
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Next" should be enabled

        When I click the "×" button
        Then I should see "Get your location"
        And search box should contain ""
        And the button "Next" should be disabled

        When I reload the page
        When I search for blank
        Then I should see "Get your location"
        And search box should contain ""
        And the button "Next" should be disabled

        When I search for blank
        When I click the "Get your location" button
        Then I should see "Found your location"
        And search box should contain "Richmond, VIC"
        And the button "Next" should be enabled

        When I reload the page
        When I search for blank
        Then I should see "Get your location"
        And search box should contain ""
        And the button "Next" should be disabled

    Scenario: User uses geolocate button on results page after setting their location manually
        Given the area to search is "Melbourne, VIC"
        And google api geocode will return location name Richmond, VIC
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

        When I visit /housing
        Then I should see "Showing housing services"
        And I should see "Want to see estimated travel times for the services below?"

        Given GPS will hang in the loading state
        When I click the "Get your location" button
        Then I should see "Locating you..."

        Given the GPS returns 37.823S 144.998E
        Then I should see "Found your location (in Richmond, VIC) – Travel times added below.Clear"

        And I reload the page
        Then I should see "Found your location (in Richmond, VIC) – Travel times added below.Clear"

        When I click the "Clear" button
        And I should see "Get your location"

        Given google api geocode will return location name Melbourne, VIC
        And I reload the page
        Then I should see "Get your location"

        When I click the "Get your location" button
        Then I should see "Found your location (in Melbourne, VIC) – Travel times added below.Clear"
