Feature: Search for housing services
    Background:
        Given I have deleted all answers
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Crisis in Taigum
        Given my location is "Taigum, Queensland"
        And I have nowhere to sleep tonight
        And I have skipped setting my age
        And I have skipped setting my gender
        Then my results for housing should contain
        ----------------------------------
        - id: 878723
          site:
            name: Queensland Department of Housing & Public Works, Housing Service Centre, Chermside
        - id: 1021720
          crisis: true
          site:
            name: Homeless Hotline
        - id: 645116
          site:
            name: Australian Community Safety & Research Organisation (ACRO)
        - id: 894168
          site:
            name: Youth Emergency Services
        - id: 798820
          site:
            name: Queensland Homicide Victims' Support Group
        - id: 2752743
          site:
            name: Waimarie Queensland
        ----------------------------------
          And my results for housing would ideally contain
        ----------------------------------
        - id: 770140
          site:
            name: Integrated Family & Youth Service
        ----------------------------------

    Scenario: Adult man in Geelong
        Given my location is "Geelong, Victoria"
        And I have somewhere to sleep tonight
        And I am 30 years old
        And my gender is male
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
        And my gender is female

        # These are services for the aged...
        Then my results for housing should not contain
        ----------------------------------------------
        - site:
            name: Lifeview, The Willows
        ----------------------------------
        And my results for housing should contain
        ----------------------------------
        - id: 2721562
          crisis: true
          site:
            name: Victorian Statewide Homelessness Line
        ----------------------------------
          And my results for housing would ideally not contain
        ----------------------------------
        - site:
            name: UnitingCare lifeAssist, Homeshare
        ----------------------------------
