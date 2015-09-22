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
