# Taken from HSNet testing

Feature: Search for alcohol counselling
    Background:
        Given I have deleted all answers
        And I am not interested in any subcategory

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
            name: Sydney Drug Education & Counselling Centre (SDECC)
        - id: 1851455
          site:
            name: Life Supports, Manly (Central Avenue)
        ----------------------------------
