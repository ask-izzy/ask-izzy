Feature: Opening times

    # As a user
    # When I visit a category
    # I want to see the opening times of results
    # So that I can choose a service

    Scenario: Can show opening time tomorrow
        Given my location is "Melbourne VIC"
        And it is late on Tuesday
        # Navigating will undo the mocked time
        When I click on "Food"
        Then I should see the results
        ------------------------------
        Opening hours (OpeningTimes)
        ==============================
        Closed until tomorrow 9:00 AM
        ------------------------------

    Scenario: Can show opening time 2 days hence
        Given my location is "Melbourne VIC"
        And it is late on Monday
        # Navigating will undo the mocked time
        When I click on "Food"
        Then I should see the results
        ------------------------------
        Opening hours (OpeningTimes)
        ==============================
        Closed until Wednesday 9:00 AM
        ------------------------------

    Scenario: Can show opening time next week
        Given my location is "Melbourne VIC"
        And it is late on Wednesday
        # Navigating will undo the mocked time
        When I click on "Food"
        Then I should see the results
        -------------------------------------
        Opening hours (OpeningTimes)
        =====================================
        Closed until next Wednesday 9:00 AM
        -------------------------------------
