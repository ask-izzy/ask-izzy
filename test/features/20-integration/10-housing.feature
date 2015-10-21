Feature: Search for housing services

    Scenario: youth woman in Wheelers Hill
        Given my location is "Wheelers Hill, Victoria"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

        When I visit /category/housing

        Then my results should not contain
        --------------------------------------------------------
        Service Name (name) | Site Name (site_name)
        ========================================================
        Homeshare           | UnitingCare lifeAssist, Homeshare
        --------------------------------------------------------
