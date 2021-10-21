Feature: Transport times

    # As a user
    # When I visit a category
    # I want to see the transport time to the results
    # So that I can choose nearby services

    Background:
        Given the area to search is "Melbourne, VIC"
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Show transport times
        Given my location is 37.822S 144.99E in "Richmond, VIC"
        and A service with:
        ----------------------------------------------
        name: "Transportable"
        location:
            suburb: Richmond
            point:
                lat: -37.8578706
                lon: 144.5192432
        ----------------------------------------------
        And googles directions matrix will return
        ----------------------------------------------
        - status: OK
          duration:
              text: 8 hours 27 mins
              value: 8000
          distance:
              value: 1000
        ----------------------------------------------
        When I search for the service
        Then I should see a transport time of
        ------------------------------------------
        8 hours 27 mins transport
        ------------------------------------------

        When I reload the page
        Then I should see a transport time of
        ------------------------------------------
        8 hours 27 mins transport
        ------------------------------------------

        When I click on "Transportable"
        Then I should see a transport time of
        ------------------------------------------
        8 hours 27 mins transport
        ------------------------------------------

        When I reload the page
        Then I should see a transport time of
        ------------------------------------------
        8 hours 27 mins transport
        ------------------------------------------

    Scenario: Change location on results page
        Given GPS will hang in the loading state
        And A service with:
        ----------------------------------------------
        name: "Transportable"
        location:
            suburb: Richmond
            point:
                lat: -37.8578706
                lon: 144.5192432
        ----------------------------------------------
        And googles directions matrix will return
        ----------------------------------------------
        - status: OK
          duration:
              text: 8 hours 27 mins
              value: 8000
          distance:
              value: 1000
        ----------------------------------------------
        And google api geocode will return location name Richmond, VIC
        And the GPS returns 37.822S 144.99E

        When I search for the service
        Then I should not see transport times

        When I click on "Get your current location"
        Then I should see "Found your location (in Richmond, VIC) – Travel times added below.Clear"
        And I should see a transport time of
        ------------------------------------------
        8 hours 27 mins transport
        ------------------------------------------

        When I click on "Clear"
        Then I should not see transport times

        When I click on "Transportable"
        Then I should not see transport times
