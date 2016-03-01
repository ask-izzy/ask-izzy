Feature: Search for money help
    Background:
        Given I have deleted all answers
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: No historic restoration when looking for nils
        Given my location is "Bendigo, Victoria"
        And I need the following for money: No interest loans
        Then my results for money-help should not contain
        ----------------------------------
        - id: 1224840
          name: Heritage Advisory Service & Restoration Loan Scheme
        ----------------------------------
