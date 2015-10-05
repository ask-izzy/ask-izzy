Feature: Transport times

    # As a user
    # When I visit a category
    # I want to see the transport time to the results
    # So that I can choose nearby services

    Background:
        Given my location is "Melbourne VIC"
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Show transport times
       Given A service with:
        ----------------------------------------------
        * Location
            Suburb        | Richmond
        ----------------------------------------------

        When I search for the service
        Then I should see a transport time of "? mins Richmond"

        When I navigate to the service page
        Then I should see a transport time of
        ------------------------------------------
        ? mins Richmond
        Get directions
        ------------------------------------------

