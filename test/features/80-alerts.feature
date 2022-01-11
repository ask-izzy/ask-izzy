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
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I need nothing for everyday-things
        When I visit /everyday-things
        Then I should see "COVID19 affecting services"
        And I should not see "Services listed here may not be operating or limited. Contact services directly for up-to-date information."

        When I click the "COVID19 affecting services" collapsible section
        Then I should see "Services listed here may not be operating or limited. Contact services directly for up-to-date information."

    Scenario: Alerts defaultToOpen are initially open
        Given the area to search is "Melbourne, VIC"
        And I need help for myself
        And I need nothing for everyday-things
        When I visit /everyday-things
        Then I should see "Title is always shown"
        And I should see "Body is open by default"

        When I click the "Title is always shown" collapsible section
        Then I should see "Title is always shown"
        And I should not see "Body is open by default"


    # Tests both that alerts show up correctly on the results page
    # and they are correctly ordered by importance
    Scenario: Alerts are displayed on the results page and are ordered correctly
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
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
        Title is*           | Body is*
        -------------------------------------------


    # Tests both that alerts show up correctly on a service page
    # and that state specific alerts are shown for the service
    # location, not the user location.
    Scenario: National and alerts in the same state as the service are visible
        Given a fresh session
        And the area to search is "Perth, WA"
        When I visit /service/866464
        Then I should see the alerts
        -------------------------------------------
        Title               | Body
        ===========================================
        A vic service page* |
        A national service* |
        -------------------------------------------
