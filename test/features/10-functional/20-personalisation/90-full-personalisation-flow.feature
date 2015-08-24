Feature: Personalisation

    # As a user
    # When I do a search
    # I want to have my results personalised with my current location
    # And ...
    # So that I get personalised results

    Scenario: Search for housing with personalised results
        When I visit /
        And I click on "Housing"
        Then I should see "Where are you?"

        Given control of geolocation
        When I click on "Get current location"

        Given I'm at 37.823S 144.998E
        Then I should see "Found your location"
        And search box should contain "Richmond VIC"

        When I click on "Done"
        # FIXME: more personalisation steps go in here
        Then I should see "Housing"
