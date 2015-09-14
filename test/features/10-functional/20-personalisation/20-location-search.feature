Feature: Location search

    # As a user
    # When I do a search
    # I want to personalise my search with a suburb or postcode
    # So that I get personalised results for the area I'm interested in

    Scenario: Search for a suburb
        Given my location is 37.823S 144.998E
        When I visit /category/housing/personalise?subpage=location
        Then I should see "Where are you?"

        When I search for "carlt"
        Then I should see the results
        -------------------------------------------
        First line (suburb) | Second line (state)
        ===========================================
        Carlton             | Victoria
        Carlton North       | Victoria
        -------------------------------------------

        When I click on "Carlton"
        Then search box should contain "Carlton, Victoria"
        And the button "Done" should be enabled

    Scenario: Suburb search normalises spaces
        When I visit /category/housing/personalise?subpage=location
        And I search for "  north melbourne"
        Then search box should contain "north melbourne"
