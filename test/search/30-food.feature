Feature: Search for Food subcategories
    Background:
        Given I have deleted all answers

    Scenario: No subcategory selected in Melbourne
        Given my location is "Melbourne, VIC"
        And I have skipped setting my sub-food
        Then my results for food should contain
        ----------------------------------
        - id: 2614311
          name: "Community Kitchen"

    Scenario: Community Meals subcategory in Melbourne
        Given my location is "Melbourne, VIC"
        And I need the following for food: Community meals
        Then my results for food should contain
        ----------------------------------
        - id: 1219047
          name: "Credo Cafe Free Meals"
        - id: 2791011
          name: "The Friday Night Kitchen"
        - id: 1220147
          name: "Hamodava Cafe Community Meals"

    Scenario: Food Packages subcategory in Melbourne
        Given my location is "Melbourne, VIC"
        And I need the following for food: Food packages/parcels/vouchers
        Then my results for food should contain
        ----------------------------------
        - id: 1220150
          name: "The Marketplace"
        - id: 1221084
          name: "Food for Families"
        - id: 2482167
          name: "Food Bank"

    Scenario: Meals on Wheels subcategory in Melbourne
        Given my location is "Melbourne, VIC"
        And I need the following for food: Meals on Wheels
        Then my results for food should contain
        ----------------------------------
        - id: 1218790
          name: "Aged & Disability Services: Meals on Wheels (HACC)"
        - id: 779018
          name: "Meals on Wheels (HACC)"
        - id: 921058
          name: "Aged & Disability: Meals on Wheels (HACC)/(CHSP)"