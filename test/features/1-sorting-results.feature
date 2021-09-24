Feature: Sorting drop down on the results page
  To test the sorting feature on the results page

    Background:
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am not part of any relevant demographics

    Scenario: Sort list from Best Match to Open Now
        When I visit /housing
        Then I should see "Sort by"
        And I should see the results
        ------------------------------------------------------------------------------------------
        Service Name (name)          | Site Name (site_name) | Service provisions (ServiceProvisions)
        ==========================================================================================
        Housing Service              | My Housing Service    | (nada)
        Transitional Housing Service | My Housing Service    | Transitional accommodation
        Emergency Accom              | Youth Support Net     | (nada)
        Open service                 | Open site             | (nada)
        Womens Refuge                | Susan's House         | Crisis accommodation
        ------------------------------------------------------------------------------------------
        When I click on "Best match"
        And I click on "Open now"
        And I should see the results
        ------------------------------------------------------------------------------------------
        Service Name (name)          | Site Name (site_name) | Service provisions (ServiceProvisions)
        ==========================================================================================
        Transitional Housing Service | My Housing Service    | Transitional accommodation
        Emergency Accom              | Youth Support Net     | (nada)
        Open service                 | Open site             | (nada)
        Womens Refuge                | Susan's House         | Crisis accommodation
        Housing Service              | My Housing Service    | (nada)
        ------------------------------------------------------------------------------------------
