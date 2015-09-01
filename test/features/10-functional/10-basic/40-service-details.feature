Feature: Service details page

    # As someone searching for services
    # I want to view the details of a service
    # So that I know if this service meets my needs

    Scenario: Description is limited to one sentence
        When I visit /service/13841
        Then I should see "A service."
        And I should not see "Provides free legal advice to people."
