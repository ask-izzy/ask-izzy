Feature: Other services panel

    # As a user
    # When I look through my search results
    # I want to see suggestions for other services I may need
    # So that I can find related help without starting a new search

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    # @see docs/other-services-panel.md § "Where the panel appears"
    Scenario: The panel is shown after the last result once every page has loaded
        When I visit /housing
        Then I should see "Showing housing services"
        And I should not see "See more results"
        And I should see other services panels after results 4

    # @see docs/other-services-panel.md § "Where the panel appears"
    Scenario: The panel is shown after the 4th result, before each "See more results" and stays as more load
        When I visit /everyday-needs
        Then I should see "See more results"
        And I should see other services panels after results 4, 5

        When I click the "See more results" button
        And I wait for 10 results to load
        Then I should see other services panels after results 4, 5, 10

    # @see docs/other-services-panel.md § "Changing where the panel appears in debug mode"
    Scenario: In debug mode the position of the panel within the first page can be changed and is remembered
        When I visit /everyday-needs
        And I enable debug mode
        And I click the "Debug other services panel" button
        And I enter "2" into the "Also show the panel in the first page" field
        Then I should see other services panels after results 2, 5

        When I reload the page
        Then I should see other services panels after results 2, 5

        When I click the "See more results" button
        And I wait for 10 results to load
        Then I should see other services panels after results 2, 5, 10

    # @see docs/other-services-panel.md § "Changing where the panel appears in debug mode"
    Scenario: In debug mode the panel within the first page can be turned off
        When I visit /everyday-needs
        And I enable debug mode
        And I click the "Debug other services panel" button
        And I enter "0" into the "Also show the panel in the first page" field
        Then I should see other services panels after results 5

    # @see docs/other-services-panel.md § "Changing where the panel appears in debug mode"
    Scenario: The changed position is still used after debug mode is turned off
        When I visit /everyday-needs
        And I enable debug mode
        And I click the "Debug other services panel" button
        And I enter "2" into the "Also show the panel in the first page" field
        Then I should see other services panels after results 2, 5

        When I click the "Turn off debug mode" button
        Then I should not see "Debug other services panel"
        And I should see other services panels after results 2, 5

        When I reload the page
        Then I should see other services panels after results 2, 5

    # @see docs/other-services-panel.md § "Changing where the panel appears in debug mode"
    Scenario: The changed position can be reset to the default
        When I visit /everyday-needs
        And I enable debug mode
        And I click the "Debug other services panel" button
        And I enter "2" into the "Also show the panel in the first page" field
        Then I should see other services panels after results 2, 5

        When I click the "Reset to default (4)" button
        Then I should see other services panels after results 4, 5

    # @see docs/other-services-panel.md § "Where the panel appears"
    Scenario: Crisis results don't count towards where the panel goes
        When I visit /food
        Then I should see "For help and safety call:"
        And I should see other services panels after results 2

    # @see docs/other-services-panel.md § "Where the panel appears"
    Scenario: The panel isn't shown when there are no results
        When I visit /
        And I search for ""zero results"" and press enter
        Then I should see "Sorry, we weren't able to find any services matching your search for “zero results”."
        And I should not see "People also searched for"

    # @see docs/other-services-panel.md § "How the panel looks"
    # @see docs/other-services-panel.md § "Turning a related search back into a flow"
    Scenario: Related searches are shown under a "People also searched for" heading
        When I visit /everyday-needs
        Then I should see "People also searched for"
        And I should see "Meals"
        And I should see "Food vouchers"
        And I should see "Drugs and alcohol counselling"
        And I should see "relief"
        And I should not see "no longer used"

    # @see docs/other-services-panel.md § "What clicking a suggestion does" - All details known
    Scenario: A suggestion with every detail known shows matching services
        When I visit /housing
        And I click the "Meals" link
        Then I should be at /food/Melbourne-VIC
        And I should see "Showing food services"

    # @see docs/other-services-panel.md § "What clicking a suggestion does" - Extra details needed
    Scenario: A suggestion needing extra details shows the personalisation wizard
        Given I have not said who is looking for help with support-and-counselling
        When I visit /housing
        And I click the "Drugs and alcohol counselling" link
        Then I should be at /support-and-counselling/Melbourne-VIC/personalise/page/who-is-looking-for-help-support-and-counselling

    # @see docs/other-services-panel.md § "What clicking a suggestion does" - A keyword search
    Scenario: A plain related search that isn't a known flow does a keyword search
        When I visit /housing
        And I click the "relief" link
        Then I should be at /search/relief/Melbourne-VIC

    # @see docs/other-services-panel.md § "Turning a related search back into a flow"
    # @see docs/other-services-panel.md § "What clicking a suggestion does"
    Scenario: A suggestion for the current category says what it changes and changes it
        Given I am interested in the "Meals" subcategory for food
        When I visit /food
        Then I should see "Food without meals"

        When I click the "Food without meals" link
        Then I should be at /food/Melbourne-VIC
        And I should see "Showing food services"
        And I should not see "Food without meals"
