Feature: Service details page

    # As someone searching for services
    # I want to view the details of a service
    # So that I know if this service meets my needs

    Scenario: Description is limited to one sentence
        When I visit /service/13841
        Then I should see "A service."
        And I should not see "Provides free legal advice to people."

    Scenario: The description is limited to a set of dot points
        When I visit /service/13841
        Then I should see "Advice on legal matters"

    Scenario: The address is a link to google maps
        When I visit /service/866464
        Then I can get to google maps by clicking "33 Elizabeth Street Richmond VIC 3121"

    Scenario: The phone numbers (without fax) are available
        When I visit /service/5551234
        Then I should see the phone numbers
        -------------------------------------------
        Freecall 1300 111 111
        -------------------------------------------
        When I click on "Other contact options"
        Then I should see the phone numbers
        -------------------------------------------
        Freecall 1300 111 111
        Phone (03) 3333 3333
        Phone 0477 777 777 (really a mobile)
        -------------------------------------------
