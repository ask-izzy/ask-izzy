Feature: My List

    # As a user
    # When I visit My List page 
    # I want to be able to see all the services added to my list

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
        And I am 17 years old
        And I am not part of any relevant demographics

    Scenario: Add / Remove items to my list from results page
        When I visit /housing
        And I should see the results
        ------------------------------------------------------------------------------------------
        Service Name (name)          | Site Name (site_name) | Service provisions (ServiceProvisions)
        ==========================================================================================
        Housing Service              | My Housing Service    | (nada)
        Transitional Housing Service | My Housing Service    | Transitional accommodation
        Emergency Accom              | Youth Support Net     | (nada)
        Womens Refuge                | Susan's House         | Crisis accommodation
        ------------------------------------------------------------------------------------------
        When I click the button with ".AddToCompare" class name
        Then I should see "1" services in my list
        When I click the button with ".RemoveFromCompare" class name
        Then I should see "0" services in my list

    Scenario: Add / Remove my list items from service page
        Given A service with:
        ----------------------------------------------
        description: There is a service here, and its really quite helpful. You can get all sorts of things - blankets, food, other stuff too. I suggest you drop by and check us out. Our service is the best, its really just the best. Not sure why you're still reading at this point. Also we have penguins.
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "There is a service here, and its really quite helpful."
        When I click the button with ".AddToCompare" class name
        Then I should see "1" services in my list
        When I click the button with ".RemoveFromCompare" class name
        Then I should see "0" services in my list
        
        
    Scenario: Clear all from My List page
        When I visit /housing
        And I should see the results
        ------------------------------------------------------------------------------------------
        Service Name (name)          | Site Name (site_name) | Service provisions (ServiceProvisions)
        ==========================================================================================
        Housing Service              | My Housing Service    | (nada)
        Transitional Housing Service | My Housing Service    | Transitional accommodation
        Emergency Accom              | Youth Support Net     | (nada)
        Womens Refuge                | Susan's House         | Crisis accommodation
        ------------------------------------------------------------------------------------------
        When I click the button with ".AddToCompare" class name
        Then I should see "1" services in my list

        When I visit /my-list
        Then I should see "1" services in my list
        And I should see the results
        ------------------------------------------------------------------------------------------
        Service Name (name)          | Site Name (site_name) | Service provisions (ServiceProvisions)
        ==========================================================================================
        Housing Service              | My Housing Service    | (nada)
        ------------------------------------------------------------------------------------------

        When I click the "Clear all" button
        
        When I click the "Clear My List" button
        Then I should see "Your list is empty"
        And Then I should see "0" services in my list
        And Then I should see "UNDO"

        ---------------
        And I should see the branding footer

        



