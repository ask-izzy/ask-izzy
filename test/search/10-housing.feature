Feature: Search for housing services
    Background:
        Given I have deleted all answers
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Adult man in Geelong
        Given my location is "Geelong, Victoria"
        And I have somewhere to sleep tonight
        And I am 30 years old
        Then my results for housing should contain
        ----------------------------------
        - id: 2721562
          crisis: true
          site:
            name: Victorian Statewide Homelessness Line
        - id: 2525557
          name: "Crisis Housing Assistance for Over 25's"
          site:
            name: Barwon Local Area Service Network
        - id: 2484242
          name: Long-Term Housing
          site:
            name: Yarra Community Housing, Geelong West
        ----------------------------------

    Scenario: Teenaged woman in Wheelers Hill
        Given my location is "Wheelers Hill, Victoria"
        And I have somewhere to sleep tonight
        And I am 17 years old

        # These are services for the aged...
        Then my results for housing should not contain
        ----------------------------------------------
        - site:
            name: UnitingCare lifeAssist, Homeshare
        - site:
            name: Lifeview, The Willows
        ----------------------------------
        And my results for housing should contain
        ----------------------------------
        - site:
            name: Ermha, Prevention & Recovery Care
        - id: 2721562
          crisis: true
          site:
            name: Victorian Statewide Homelessness Line
        ----------------------------------
