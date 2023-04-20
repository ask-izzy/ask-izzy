Feature: Crisis Line

    # As a user
    # When I select any category
    # I want to see results including the crisis phone numbers
    # So that I can use the number to get help

    Background:
        Given the area to search is "Melbourne, VIC"
        And my gender is female
        And I need help for myself
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
        Then I should be at /search/get helpline phone number/Melbourne-VIC
        And I should see a hotline in position 1 which says "Call (03) 3333 3333"
        And I should see a hotline in position 2 which says "Call 03 1111 1111"
        And I should see "For help and safety call:" before first hotline

    Scenario: Search for helpline phone numbers for domestic violence
        When I visit /
        And I search for "domestic violence"
        And I click the "Search" button
        And I click the "Skip" button
        Then I should see a hotline in position 1 which says "Call 1800 737 732"
        And I should see "For help and safety call:" before first hotline

    Scenario: Show extra call information
        When I visit /
        And I search for "domestic violence"
        And I click the "Search" button
        And I click the "Skip" button
        When I click the button with "Button tooltip-children-container" class name
        Then I should see "This call may not be free from mobiles. If you are ringing from a mobile you can ask to be called back"

    Scenario: Not see extra call information
        When I visit /
        And I search for "get helpline phone number"
        And I click the "Search" button
        Then I should not see "Call Info"
