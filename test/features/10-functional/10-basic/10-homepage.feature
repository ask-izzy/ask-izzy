Feature: Landing page

    # As a user
    # When I come to Ask Izzy
    # I want to see a landing page with information and a link to click through
    # So that I can understand what Ask Izzy provides

    Scenario: Visit home page
        When I visit /
        Then I should see the branding header
        And I should see the search bar
        And I should see the list of categories
        ---------------
        Housing
        Food
        Everyday things
        Legal
        Money Help
        Health
        Addiction
        Support & counselling
        Life skills & education
        Finding work
        Centrelink
        Something to do
        Facilities
        Technology
        ---------------
        And I should see the branding footer

    Scenario: Navigate to a category
        Given my location is "Melbourne VIC"
        When I visit /
        And I click on "Housing"
        Then I should be at /category/housing
        And I should see "Housing"
