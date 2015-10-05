Feature: Category page

    # As a user
    # When I visit a category
    # I want to see relevant results
    # So that I can choose a service

    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Visit housing category
        When I visit /category/housing
        Then I should see "Housing"
        And I should see "I found these services for you"
        And I should see "It's important to act early on housing"
        And I should see the results
        --------------------------------------------------------------------------
        Service Name (name) | Site Name (site_name) | Service provisions (related)
        ==========================================================================
        Housing Service     | My Housing Service    | (nada)
        Emergency Accom     | Youth Support Net     | (nada)
        Womens Refuge       | Susan's House         | Crisis accommodation
        --------------------------------------------------------------------------

        # The housing category has 3 results
        And I should not see "Load more results…"

    Scenario: Navigate to a service and back to a category
        When I visit /category/housing
        And I click on "Housing Service"
        Then I should see "A housing service for people."

        When I click back from the title bar
        Then I should see "Emergency Accom"
        And I should be at /category/housing

    Scenario: A service with 5 related services only shows 4
        When I visit /category/food

        Then I should see the results
        ------------------------------
        Service Provisions (provision)
        ==============================
        Lunch
        Advice
        Support services
        Housing referrals
        ------------------------------

        And I should not see "Mental health referrals"
        And I should see "1 more…"

    Scenario: I should never see "invalid date"
        When I visit /category/housing
        Then I should not see "Invalid date"

    Scenario: Visit a category with more than 5 services
        When I visit /category/everyday-things
        Then I should see "Load more results…"

        When I click on "Load more results…"
        Then I should see the results
        --------------------
        Service Name (name)
        ====================
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        Community Lunch
        --------------------
