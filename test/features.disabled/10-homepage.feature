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
        Health
        Centrelink
        Money help
        Support & counselling
        Legal
        Drugs & alcohol
        Life skills & education
        Finding work
        Facilities
        Something to do
        Technology
        Advocacy
        ---------------
        And I should see the branding footer
