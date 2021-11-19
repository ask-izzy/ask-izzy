Feature: Search

    # As a user
    # When I do a search for something not in the categories
    # I want to see those search results
    # So that I can search for things not in the category list

    Background:
        Given the area to search is "Melbourne, VIC"
        And my gender is female
        And I need help for myself
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Search for "pets" using keyboard
        When I search for "pet food" and press enter
        Then I should be at /search/pet food
        # FIXME: make the mock produce more meaningful results
        And I should see the results
        ----------------------------------------------------
        Service Name (name)          | Site Name (site_name)
        ====================================================
        Housing Service              | My Housing Service
        Transitional Housing Service | My Housing Service
        Emergency Accom              | Youth Support Net
        Womens Refuge                | Susan's House
        ----------------------------------------------------

    Scenario: Search for pets using keyboard and mouse
        When I search for "pet food"
        And I click the "Search" button
        Then I should be at /search/pet food

    Scenario: Search on blank does not search
        When I click the "Search" button
        Then I should be at /

    Scenario: Search with zero results displays a different sentence
        When I search for ""zero results"" and press enter
        Then I should see "Sorry, we weren't able to find any services matching your search for “zero results”."
        And I should not see "View on a map"

    Scenario: Search returning an error returns a nice sentence
        When I search for "cause error" and press enter
        Then I should see "Sorry, we weren't able to find any services matching your search for “cause error”."

    Scenario: Searching for domestic violence performs the safety check
        When I search for "domestic violence" and press enter
        Then I should see "Are you safe right now?"
        And I click the "Yes" button
        Then I should see "I'm looking for help for"
