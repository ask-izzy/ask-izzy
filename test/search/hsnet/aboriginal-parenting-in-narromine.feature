# Taken from HSNet testing

Feature: Search for indigenous childrens health services
    Background:
        Given I have deleted all answers

    Scenario: Looking for indigenous childrens health in Narromine
        Given my location is "Narromine, NSW"
        And I am not interested in any subcategory
        And I have skipped setting my gender
        And I have skipped setting my age
        And I am part of the following demographics
        --------------------------------------
        Indigenous
        --------------------------------------
        Then my results for health would ideally contain
        ----------------------------------
        - id: 110947
          crisis: true
          site:
            name: Tresillian Parent Helpline
        - id: 1818514
          crisis: true
          site:
            name: Parent Line NSW
        - id: 573258
          name: Aboriginal Maternal & Infant Health Service (AMIHS)
          site:
            name: Early Childhood Health Centre, Narromine Community Health
        - id: 350338
          name: Indigenous Parent Support Service
          site:
            name: Wellington Aboriginal Corporation Health Service
        ----------------------------------
