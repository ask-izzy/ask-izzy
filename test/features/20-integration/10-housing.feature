@integration
Feature: Search for housing services

    Scenario: Teenaged woman in Wheelers Hill
        Given my location is "Wheelers Hill, Victoria"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

        When I visit /category/housing

        # These are services for the aged...
        Then my results should not contain
        ----------------------------------
        Site Name (site_name)
        ==================================
        UnitingCare lifeAssist, Homeshare
        Lifeview, The Willows
        ----------------------------------
