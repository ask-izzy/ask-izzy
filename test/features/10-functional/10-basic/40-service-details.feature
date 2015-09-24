Feature: Service details page

    # As someone searching for services
    # I want to view the details of a service
    # So that I know if this service meets my needs

    Scenario: Description is limited to one sentence
       Given A service with:
        ----------------------------------------------
        * Description: There is a service here. Also we have penguins
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "There is a service here."
        And I should not see "Also we have penguins"

    Scenario: The service provisions is limited to a set of dot points
       Given A service with:
        ----------------------------------------------
        * Description: "legal advice"
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "Advice on legal matters"

    Scenario: Service provisions header is present if there are any
       Given A service with:
        ----------------------------------------------
        * Description: "legal advice"
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "What you can get here"

    Scenario: Service provisions header is absent if there are none
       Given A service with:
        ----------------------------------------------
        * Description: a service is here
        ----------------------------------------------
        When I navigate to the service page
        Then I should not see "What you can get here"

    Scenario: Ineligibility is present if there are criteria
       Given A service with:
        ----------------------------------------------
        * Ineligibility info: no penguins allowed
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "You are ineligible if"

    Scenario: Ineligibility is absent if there are no criteria
       Given A service with:
        ----------------------------------------------
        * Ineligibility info: (nada)
        ----------------------------------------------
        When I navigate to the service page
        Then I should not see "You are ineligible if"

    Scenario: The address is a link to google maps
        When I visit /service/866464
        Then I can get to google maps by clicking "33 Elizabeth Street Richmond VIC 3121"

    Scenario: There is travel information for non-confidential services
        When I visit /service/866464
        Then I should see "? mins"
        And I click on "Get directions"

    Scenario: There is no travel information for confidential services
        When I visit /service/537512
        Then I should see "Confidential location"
        And I should not see "Get directions"

    Scenario: The contact methods are available except fax and tty
       Given A service with:
        ----------------------------------------------
        * Phones
            kind     | number         | comment
            ==============================================
            phone    | (03) 3333 3333 |
            fax      | (03) 5555 5555 |
            mobile   | 0477 777 777   |
            phone    | 0477 777 777   | (really a mobile)
            freecall | 1300 111 111   |
            tty      | (03) 9999 9999 |
        * Emails
            email                 | comment
            ==============================================
            reception@service.org | Reception
        * Web: https://service.org
        ----------------------------------------------
        When I navigate to the service page
        Then I should see the contacts
        -------------------------------------------
        Freecall 1300 111 111
        -------------------------------------------
        When I click on "Other contact options"
        Then I should see the contacts
        -------------------------------------------
        Freecall 1300 111 111
        Phone (03) 3333 3333
        (really a mobile) 0477 777 777
        Reception reception@service.org
        service.org
        -------------------------------------------

    Scenario: Can view all opening times
        When I visit /service/5551234
        And I click on "All times"

        Then I should see the results
        ----------------------------
        Day (day) | Time (time)
        ============================
        Monday    | 9:00 AM–5:00 PM
        Tuesday   | 9:00 AM–5:00 PM
        Wednesday | 8:00 AM–5:00 PM
        Thursday  | 9:00 AM–5:00 PM
        Friday    | 9:00 AM–5:00 PM
        ----------------------------
