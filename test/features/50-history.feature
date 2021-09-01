Feature: History navigation

    # As a user
    # When I visit a page
    # I want to be able to use the back button to navigate
    # And I want it to take me to the home page if I haven't previously visited
    #     any Ask Izzy pages this session.
    Scenario: Bookmark a service page and press back to reach home page
        Given I open a new browser
        When I visit /service/111-my-housing-service
        And I click home from the title bar
        Then I should be at /
        And I should see the branding header

    Scenario: Navigate via category to a service and back to the personalisation page
        Given a fresh session
        And my location is "Melbourne, VIC"
        And I am not part of any relevant demographics

        When I visit /
        And I click on "A place to stay"

        Then I should see "I'm looking for help for"
        And I should be at /accommodation/personalise

        When I click on the done button # Intro

        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click back from the browser UI
        Then I should see "Do you identify as…"

        When I click on "Male"
        Then I should see "How old are you?"

        When I click on "18 to 26"

        Then I should see "Melbourne, VIC | Men | 18-26"
        And I should see "Showing a place to stay services"
        And I should be at /accommodation/Melbourne-VIC/
        And I should see the results
        ------------------------------------------------------------------------------------------
        Service Name (name)          | Site Name (site_name) | Service provisions (ServiceProvisions)
        ==========================================================================================
        Housing Service              | My Housing Service    | (nada)
        Transitional Housing Service | My Housing Service    | Transitional accommodation
        Emergency Accom              | Youth Support Net     | (nada)
        Womens Refuge                | Susan's House         | Crisis accommodation
        ------------------------------------------------------------------------------------------

        When I click on "Housing Service"
        Then I should be at /service/111-my-housing-service
        And I should see "A housing service for people."

        When I reload the page
        And I click back from the browser UI

        Then I should be at /accommodation/Melbourne-VIC/

        And I should see "Melbourne, VIC | Men | 18-26"

        When I click back from the browser UI
        Then I should see "How old are you?"
