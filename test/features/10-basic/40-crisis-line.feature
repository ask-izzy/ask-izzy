Feature: Crisis Line

    # As a user
    # When I select any category
    # I want to see results including the crisis phone numbers
    # So that I can use the number to get help

    Background:
        Given my location is "Melbourne, VIC"
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: Get helpline phone number
       Given A search for "get helpline phone number" returns:
        ----------------------------------------------
        -   crisis: true
            phones:
                - kind        : phone
                  number      : (03) 3333 3333
                  comment     :
        -   crisis: true
            phones:
                - kind        : phone
                  number      : 03 1111 1111
                  comment     :
        ----------------------------------------------
        When I visit /
        And I search for "get helpline phone number" and press enter
        Then I should be at /search/get helpline phone number
        And I should see a hotline in position 1 which says "(03) 3333 3333"
        And I should see a hotline in position 2 which says "03 1111 1111"
        And I should see "If you need urgent help call one of these numbers" before first hotline

    Scenario: Search for helpline phone numbers for domestic violence
        When I visit /
        And I search for "domestic violence"
        And I click on the search icon
        Then I should see a hotline in position 1 which says "1800 737 732"
        And I should see "If you need urgent help call this number" before first hotline
