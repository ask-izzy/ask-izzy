Feature: Category page

    # As a user
    # When I visit a category
    # I want to see relevant results
    # So that I can choose a service

    Scenario: Visit housing category
        When I visit /housing
        Then I should see "Housing"
        And I should see the results
        --------------------------------------
        Service Name    | Site Name
        ======================================
        Housing Service | Some Housing Service
        --------------------------------------
