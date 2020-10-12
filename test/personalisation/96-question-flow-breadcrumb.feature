
Feature: Question Flow Breadcrumb
  This feature is to include a running feed of the selected questions

    Scenario: Visit the Intro page for the first time and not show my location
        Given a fresh session
        When I visit /
        And I click on "Rent and tenancy help"

        Then I should see "I'm looking for help for"
        And I should be at /rent-and-tenancy/personalise
        And I should not see "Clear saved location"

    Scenario: Visit a category page for the first time and have my location visible
        Given a fresh session
        And my location is "Melbourne, VIC"
        When I visit /
        And I click on "A place to stay"
        Then I should see "I'm looking for help for"
        And I should be at /accommodation/personalise
        And I should see "Melbourne, VIC"

    Scenario: Visit a place to stay and have your answers follow you to the last question
        Given a fresh session
        And my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I click on "A place to stay"
        Then I should see "I'm looking for help for"
        And I should be at /accommodation/personalise
        When I click on the done button # Intro
        And I should see "Help finding a place to live long term | Melbourne, VIC  |  Women  |  18-26"

    Scenario: Visit a place to stay and go back to edit your age
        Given a fresh session
        And my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I click on "A place to stay"
        Then I should see "I'm looking for help for"
        And I should be at /accommodation/personalise
        When I click on the done button
        And I click back from the browser UI
        Then I should see "Melbourne, VIC"

    Scenario: Visit a place to stay and select more than one demographic
        Given a fresh session
        And my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        --------------------------------------
        When I click on "A place to stay"
        Then I should see "Help finding a place to live long term | Melbourne, VIC | Women | 18-26 | Families , Couples"

    Scenario: Visit a place to stay and select more than two demographic
        Given a fresh session
        And my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        Have a disability
        --------------------------------------
        When I click on "A place to stay"
        Then I should see "Help finding a place to live long term | Melbourne, VIC | Women | 18-26 | Families , Couples ..."

    Scenario: Visit housing and select more than two demographic and edit
        Given a fresh session
        And my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        Have a disability
        --------------------------------------
        When I click on "A place to stay"
        Then I should see "Help finding a place to live long term | Melbourne, VIC | Women | 18-26 | Families , Couples ..."
        When I click on "See all and edit"
        And I click on "Do any of these apply to you?"
        And I should see "Help finding a place to live long term | Melbourne, VIC | Women | 18-26 | Families , Couples ... (editing)"
        And I click on "Have a disability"
        When I click on the done button # Demographics
        And I click on the done button
        Then I should see "Help finding a place to live long term | Melbourne, VIC | Women | 18-26 | Families , Couples"

    Scenario: See saved location on the home page
        Given a fresh session
        And my location is "Melbourne, VIC"
        When I visit /
        Then I should see "Melbourne, VIC"
        And I should see "Clear saved location"
