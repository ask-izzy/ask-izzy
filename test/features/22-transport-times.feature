Feature: Transport times

    # As a user
    # When I visit a category
    # I want to see the transport time to the results
    # So that I can choose nearby services

    Background:
        Given my location is "Melbourne, VIC"
        And my gender is female
        And I am 27 years old
        And I am not looking for any specific housing
        And I am not part of any relevant demographics

    Scenario: Show transport times
        Given A service with:
        ----------------------------------------------
        name: "Transportable"
        location:
            suburb: Richmond
            point:
                lat: -37.8578706
                lon: 144.5192432
        ----------------------------------------------
        When I search for the service
        Given I'm watching map events
        And googles directions matrix will return
        ----------------------------------------------
        - status: OK
          duration:
              text: 8 hours 27 mins
              value: 8000
          distance:
              value: 1000
        ----------------------------------------------

        When I click on "Transportable"
        Then I should see a transport time of
        ------------------------------------------
        8 hours 27 mins transport
        Get directions
        ------------------------------------------
