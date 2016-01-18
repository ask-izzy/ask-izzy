Feature: Location search

    # As a user
    # When I do a search
    # I want to personalise my search with a suburb or postcode
    # So that I get personalised results for the area I'm interested in

    Scenario: Search for a suburb
        When I visit /category/housing/personalise/page/location
        Then I should see "Where are you?"

       Given googles suburb autocomplete will return
        -------------------------------------------
        suburb              | state
        ===========================================
        Carlton             | Victoria
        Carlton North       | Victoria
        -------------------------------------------
        When I search for "carlt"
        Then I should see the results
        -------------------------------------------
        First line (suburb) | Second line (state)
        ===========================================
        Carlton             | Victoria
        Carlton North       | Victoria
        -------------------------------------------

        When I click on "Carlton"
        Then I should see "Do you have somewhere safe to sleep tonight?"

    Scenario: Suburb search normalises spaces
        When I visit /category/housing/personalise/page/location
        And I search for "  north melbourne"
        Then search box should contain "north melbourne"
