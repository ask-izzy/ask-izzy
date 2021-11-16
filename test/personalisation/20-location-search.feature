Feature: Location search

    # As a user
    # When I do a search
    # I want to personalise my search with a suburb or postcode
    # So that I get personalised results for the area I'm interested in

    Scenario: Search for a suburb
        When I visit /housing/personalise/page/location
        Then I should see "Where are you looking for help?"

        When I search for "carlt"
        And I wait for page to finish loading
        Then I should see the results
        -------------------------------------------
        First line (suburb) | Second line (state)
        ===========================================
        Carlton             | VIC
        Carlton North       | VIC
        -------------------------------------------

        When I click on "Carlton"
        Then search box should contain "Carlton, VIC"
        And the button "Next" should be enabled

    Scenario: Suburb search normalises spaces
        When I visit /housing/personalise/page/location
        And I search for "  north melbourne"
        Then search box should contain "north melbourne"
