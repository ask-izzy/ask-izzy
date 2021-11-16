
Feature: Browser tab titles
  This is to test the changing browser tab titles

    Scenario: Home page - browser tab title
        Given a fresh session
        When I visit /
        Then I should see the browser tab title of "Ask Izzy"

    Scenario: Category intro - browser tab title
        Given a fresh session
        When I visit /
        And I click on "Housing"
        Then I should see the browser tab title of "Housing (Intro) | Ask Izzy"

    Scenario: Results page - browser tab title
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        Have a disability
        --------------------------------------
        When I click on "Housing"
        Then I should see the browser tab title of "Housing in Melbourne, VIC | Ask Izzy"

    Scenario: Answer summary - browser tab title
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        Have a disability
        --------------------------------------
        When I click on "Housing"
        And I click on "See all and edit"
        Then I should see the browser tab title of "Housing - [selected answers] | Ask Izzy"

    Scenario: Answer summary - browser tab title
        Given a fresh session
        And the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 17 years old
        And I am part of the following demographics
        --------------------------------------
        Family with children
        Couples
        Have a disability
        --------------------------------------
        When I click on "Housing"
        And I click on "See all and edit"
        And I click on "Where are you looking for help?"
        Then I should see the browser tab title of "Housing (Location) - [selected answers] | Ask Izzy"
