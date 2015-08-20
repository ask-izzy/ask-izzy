Feature: Basic Search

    # As a user
    # I do a search for "shelter"
    # So that I can see the  "Search Results: shelter"
    # And I see 3 results

    Scenario: Search for "shelter"
        When I visit /
        When I search for "Shelter"
        Then I should see the results for "shelter"
