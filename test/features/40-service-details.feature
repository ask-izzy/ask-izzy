Feature: Service details page

    # As someone searching for services
    # I want to view the details of a service
    # So that I know if this service meets my needs

    Scenario: Description is limited to 250 chars + end of the sentence
       Given A service with:
        ----------------------------------------------
        description: There is a service here, and its really quite helpful. You can get all sorts of things - blankets, food, other stuff too. I suggest you drop by and check us out. Our service is the best, its really just the best. Not sure why youre still reading at this point. Also we have penguins.
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "There is a service here, and its really quite helpful."
        And I should see "You can get all sorts of things - blankets, food, other stuff too."
        And I should see "I suggest you drop by and check us out."
        And I should see "Our service is the best, its really just the best."
        And I should see "Not sure why youre still reading at this point."
        And I should not see "Also we have penguins"

    Scenario: The service provisions is limited to a set of dot points
       Given A service with:
        ----------------------------------------------
        description: "legal advice"
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "Advice on legal matters"

    Scenario: Service provisions header is present if there are any
       Given A service with:
        ----------------------------------------------
        description: "legal advice"
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "What you can get here"

    Scenario: Service provisions header is absent if there are none
       Given A service with:
        ----------------------------------------------
        description: a service is here
        ----------------------------------------------
        When I navigate to the service page
        Then I should not see "What you can get here"

    Scenario: Ineligibility is present if there are criteria
       Given A service with:
        ----------------------------------------------
        ineligibility_info: no penguins allowed
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "Ineligibility"

    Scenario: Ineligibility is absent if there are no criteria
       Given A service with:
        ----------------------------------------------
        ineligibility_info:
        ----------------------------------------------
        When I navigate to the service page
        Then I should not see "Ineligibility"

    Scenario: ATSI flags appear if there is an indigenous classification
       Given A service with:
        ----------------------------------------------
        indigenous_classification:
          - "Mainstream who cater for Aboriginal (indigenous)"
        ----------------------------------------------
        When I navigate to the service page
        Then I should see ATSI flags
    
    Scenario: ATSI flags are absent if there is no indigenous classification
       Given A service with:
        ----------------------------------------------
        indigenous_classification:
        ----------------------------------------------
        When I navigate to the service page
        Then I should not see ATSI flags

    Scenario: The address is a link to google maps
       Given A service with:
        ----------------------------------------------
        location:
            building: Hany Building
            flat_unit: Unit 5
            level: Level 3
            street_number: 33
            street_name: Elizabeth
            street_type: Street
            suburb: Richmond
            state: VIC
            postcode: 3121
        ----------------------------------------------
        When I navigate to the service page
        Then I can get to google maps by clicking "Unit 5, Level 3, Hany Building, 33 Elizabeth Street"

    Scenario: There is travel information for non-confidential services
       Given my location is "Melbourne, VIC"
       And it is late morning on "Monday"
       And googles directions matrix will return
        ----------------------------------------------
        - status: OK
          duration:
              text: 7 mins
              value: 424
          distance:
              text: 2.8 km
              value: 2790
        ----------------------------------------------
        When I visit /service/866464
        Then I can see travel times
        Then I can get to google maps by clicking "Get directions"

    Scenario: There is no travel information for new-style confidential services
        When I visit /service/537512
        Then I should see "Confidential location"
        And I should not see "Get directions"

    Scenario: There is no travel information for old-style confidential services
       Given A service with:
        ----------------------------------------------
        location:
            street_number: Confidential
            street_name: secret
        ----------------------------------------------
        When I navigate to the service page
        Then I should see "Confidential location"
        And I should not see "Get directions"

    Scenario: Walking times are present if the distance is less than 5km
       Given my location is "Melbourne, VIC"
        When I visit /service/866464
        Then I should be able to travel there "On foot"

    Scenario: Walking times is absent if the distance is greater than or equal to 5km
       Given my location is "Melbourne, VIC"
        When I visit /service/2371381
        Then I should not be able to travel there "On foot"

    Scenario: The contact methods are available except fax and tty
       Given A service with:
        ----------------------------------------------
        phones:
            - kind        : phone
              number      : (03) 3333 3333
              comment     :
            - kind        : fax
              number      : (03) 5555 5555
              comment     :
            - kind        : mobile
              number      : 0477 777 777
              comment     :
            - kind        : phone
              number      : 0477 777 777
              comment     : (really a mobile)
            - kind        : freecall
              number      : 1300 111 111
              comment     :
            - kind        : freecall
              number      : 1800 111 111
              comment     :
            - kind        : tty
              number      : (03) 9999 9999
              comment     :
        emails:
            - email       : reception@service.org
              comment     : Reception
        web: https://example.org
        ----------------------------------------------
        When I navigate to the service page
        Then I should see the contacts
        -------------------------------------------
        Freecall 1800 111 111
        Reception reception@service.org
        example.org
        -------------------------------------------
        When I click on "Other contact options"
        Then I should see the contacts
        -------------------------------------------
        Freecall 1800 111 111
        Reception reception@service.org
        example.org
        Phone (03) 3333 3333
        (really a mobile) 0477 777 777
        Phone 1300 111 111
        -------------------------------------------
        When I click on "example.org"
        Then I should be at https://example.org/

    Scenario: Can view all opening times
        When I visit /service/5551234
        And I click on "Open Times"

        Then I should see the results for "All Opening Times"
        ----------------------------
        Day (day) | Time (time)
        ============================
        Monday    | 9:00 AM–5:00 PM
        Tuesday   | 9:00 AM–1:00 PM
        Tuesday   | 2:00 PM–5:00 PM
        Wednesday | 8:00 AM–5:00 PM
        Thursday  | 9:00 AM–5:00 PM
        Friday    | 9:00 AM–5:00 PM
        ----------------------------

    Scenario: Show other services at this location
        When I visit /service/111
        Then I should see "Also at this location"
         And I should see "Transitional Housing Service"

    Scenario: Visit other services at this location
        When I visit /service/111
        Then I should see "Also at this location"
        And I should see "Transitional Housing Service"
        When I click on "Transitional Housing Service"
        Then I should be at /service/112-my-housing-service
