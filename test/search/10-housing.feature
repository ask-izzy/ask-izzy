Feature: Search for housing services
    Background:
        Given I have deleted all answers

    Scenario: Teenaged woman in Wheelers Hill
        Given my location is "Wheelers Hill, Victoria"
        And I have somewhere to sleep tonight
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

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
        ----------------------------------
