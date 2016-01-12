Feature: History navigation

    # As a user
    # When I visit a page
    # I want to be able to use the back button to navigate
    Scenario: Bookmark a service page and press back to reach home page
       Given I open a new browser
        When I visit /service/111-my-housing-service
         And I click back from the title bar
        Then I should see the branding header
        Then I should be at /

    Scenario: Navigate via category to a service and back to the personalisation page
        Given a fresh session
        And my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

        When I visit /
        And I click on "Housing"

        Then I should see "To help me find the right services I'll ask you a few questions"
        And I should be at /category/housing/personalise

        When I click on "Okay" # Intro
        Then I should see "Do you identify as…"

        When I click on "Female"
        Then I should see "How old are you?"

        When I click back from the title bar
        Then I should see "Do you identify as…"

        When I click on "Male"
        Then I should see "How old are you?"

        When I click on "25 or younger"

        Then I should see 3 search results for "men aged 25 or younger" in "Melbourne VIC"
        And I should see "Housing"
        And I should be at /category/housing/
        And I should see the results
        --------------------------------------------------------------------------
        Service Name (name) | Site Name (site_name) | Service provisions (related)
        ==========================================================================
        Housing Service     | My Housing Service    | (nada)
        Emergency Accom     | Youth Support Net     | (nada)
        Womens Refuge       | Susan's House         | Crisis accommodation
        --------------------------------------------------------------------------

        When I click on "Housing Service"
        Then I should be at /service/111-my-housing-service
        And I should see "A housing service for people."

        When I reload the page
        And I click back from the browser UI

        Then I should be at /category/housing/

        Then I should see 3 search results for "men aged 25 or younger" in "Melbourne VIC"

        When I click back from the browser UI
        Then I should see "How old are you?"
