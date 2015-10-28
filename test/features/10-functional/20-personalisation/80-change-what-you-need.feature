Feature: Change your personalisation settings

    # As a user
    # When I am in the category results
    # I want to change my previously answered personalisation questions
    # So that I can refine my search

    Background:
        Given my location is "Melbourne VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics

    Scenario: View personalisation settings and return to search
        When I click on "Housing"
        And I click on "Change what I'm looking for"
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 0 selected
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 0 selected
        ----------------------------------------------------------------

        When I click back from the title bar
        Then I should be at /category/housing

    Scenario: Edit my location setting
        When I visit /category/housing/personalise/summary
        And I click on "Where are you?"
        Then I should see "Automatically detect your location"

        When I search for "carlt"
        And I click on "Carlton"
        And I click on "Done"

        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 0 selected
        Where are you?                               | Carlton, Victoria
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 0 selected
        ----------------------------------------------------------------

    Scenario: Edit whether I have somewhere to sleep tonight
        When I visit /category/housing/personalise/summary
        And I click on "Do you have somewhere safe to sleep tonight?"
        And I click on "No"
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | No
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 0 selected
        ----------------------------------------------------------------

    Scenario: Edit housing subcategory items
        Given I need the following for housing
        -------------------------------
        In a rooming house
        -------------------------------

        When I visit /category/housing/personalise/summary
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 1 selected
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 0 selected
        ----------------------------------------------------------------

        When I click on "Which situation is most like yours?"
        Then "On the street" should not be checked
        And "Couch surfing" should not be checked
        And "In a rooming house" should be checked
        And "Private rental" should not be checked
        And "Public housing" should not be checked
        And "Mortgaged housing" should not be checked

        When I click on "In a rooming house"
        And I click on "Private rental"
        And I click on "Mortgaged housing"
        And I click on "Done"
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 2 selected
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 0 selected
        ----------------------------------------------------------------

    Scenario: Edit demographics items
        Given I am part of the following demographics
        --------------------------------------
        Aboriginal or Torres Strait Islander
        LGBTIQ
        --------------------------------------

        When I visit /category/housing/personalise/summary
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 0 selected
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 2 selected
        ----------------------------------------------------------------

        When I click on "Do any of these apply to you?"
        And I click on "Aboriginal or Torres Strait Islander"
        And I click on "Done"
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 0 selected
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Female
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 1 selected
        ----------------------------------------------------------------

    Scenario: Edit gender
        When I visit /category/housing/personalise/summary
        And I click on "How do you identify?"
        And I click on "Male"
        Then I should see "This is what you said you need. Change your answers here."
        Then I should see the results
        ----------------------------------------------------------------
        Question (primaryText)                       | Answer (secondaryText)
        ================================================================
        Do you have somewhere safe to sleep tonight? | Yes
        Which situation is most like yours?          | 0 selected
        Where are you?                               | Melbourne VIC
        How do you identify?                         | Male
        How old are you?                             | 26 to 64
        Do any of these apply to you?                | 0 selected
        ----------------------------------------------------------------
