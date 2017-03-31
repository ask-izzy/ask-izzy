# Taken from HSNet testing

Feature: Search for alcohol counselling
    Background:
        Given I have deleted all answers
        And I have answered No for indigenous

    Scenario: Alcohol abuse in manly
        Given my location is "Manly, NSW"
        And I need the following for addiction: Alcohol
        Then my results for drugs-alcohol should contain
        ----------------------------------
        - id: 1818376
          crisis: true
          site:
            name: Alcoholics Anonymous (AA), NSW Head Office
        - id: 502664
          site:
            name: Manly Community Centre
        - id: 105653
          site:
            name: Manly Drug Education & Counselling Centre (MDECC)
        - id: 111573
          site:
            name: Alcoholics Anonymous (AA), Cremorne
        - id: 109701
          site:
            name: Alcoholics Anonymous (AA), North Sydney
        ----------------------------------
