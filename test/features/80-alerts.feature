Feature: Alerts

    Scenario: National alerts are visible on the home page
        Given a fresh session
        When I visit /
        Then I should see the alerts
        -------------------------------------------
        Title               | Body
        ===========================================
        COVID19             | Hello World
        -------------------------------------------

    Scenario: Alerts with a body can be expanded
        Given my location is "Melbourne, VIC"
        And I need nothing for everyday-things
        When I visit /everyday-things
        Then I should see "COVID19 affecting services"
        And I should not see "Services listed here may not be operating or limited. Contact services directly for up-to-date information."

        When I click on a collapsible section titled "COVID19 affecting services"
        Then I should see "Services listed here may not be operating or limited. Contact services directly for up-to-date information."


    # Tests both that alerts show up correctly on the results page
    # and they are correctly ordered by importance
    Scenario: Alerts are displayed on the results page and are ordered correctly
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory
        When I visit /housing
        Then I should see the alerts
        -------------------------------------------
        Title               | Body
        ===========================================
        A vic and qld*      |
        COVID19 affecting*  | Services listed*
        The fox*            |
        -------------------------------------------


    # Tests both that alerts show up correctly on a service page
    # and that state specific alerts are shown for the service
    # location, not the user location.
    Scenario: National and alerts in the same state as the service are visible
        Given a fresh session
        And my location is "Perth, WA"
        When I visit /service/866464
        Then I should see the alerts
        -------------------------------------------
        Title               | Body
        ===========================================
        A vic service page* |
        A national service* |
        -------------------------------------------