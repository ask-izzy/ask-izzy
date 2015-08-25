Feature: Search

    # As a user
    # When I do a search for something not in the categories
    # I want to see those search results
    # So that I can search for things not in the category list

    Scenario: Search for "pets"
        Given my location is "Melbourne VIC"
        When I visit /
        And I search for "pet food" and press enter
        Then I should be at /search/pet%20food
        # FIXME: make the mock produce more meaningful results
        And I should see the results
        -------------------------------------------
        Service Name (name) | Site Name (site_name)
        ===========================================
        Housing Service     | My Housing Service
        Emergency Accom     | Youth Support Net
        Womens Refuge       | Susan's House
        -------------------------------------------
