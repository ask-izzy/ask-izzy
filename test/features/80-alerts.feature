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
        When I visit /rent-and-tenancy
        Then I should see "COVID19 affecting services"
        And I should not see "Services listed here may not be operating or limited. Contact services directly for up-to-date information."

        When I click on a collapsible section titled "COVID19 affecting services"
        Then I should see "Services listed here may not be operating or limited. Contact services directly for up-to-date information."

    Scenario: Alerts defaultToOpen are initially open
        Given my location is "Melbourne, VIC"
        When I visit /rent-and-tenancy
        Then I should see "Title is always shown"
        And I should see "Body is open by default"

        When I click on a collapsible section titled "Title is always shown"
        Then I should see "Title is always shown"
        And I should not see "Body is open by default"


    # Tests both that alerts show up correctly on the results page
    # and they are correctly ordered by importance
    Scenario: Alerts are displayed on the results page and are ordered correctly
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory
        When I visit /accommodation
        Then I should see the alerts
        -------------------------------------------
        Title               | Body
        ===========================================
        A vic and qld*      |
        COVID19 affecting*  | Services listed*
        The fox*            |
        Title is*           | Body is*
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
