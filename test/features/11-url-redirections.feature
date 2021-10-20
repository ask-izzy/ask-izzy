Feature: Landing page

    # As a user
    # When I come to Ask Izzy using old URLs
    # I want to be redirected to the right pages
    # So that I can view the contents of my saved URLs

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Visit Housing page
        When I visit /category/housing/
        Then I should be at /housing

    Scenario: Visit Housing page with location
        When I visit /category/housing/in/Sydney-NSW
        Then I should be at /housing/Sydney-NSW

    Scenario: Visit Everyday things page
        When I visit /category/everyday-things
        Then I should be at /everyday-things

    Scenario: Visit Everyday things page with location
        When I visit /category/everyday-things/in/Sydney-NSW
        Then I should be at /everyday-things/Sydney-NSW

    Scenario: Search for "room for the night" at Richmond, VIC
        When I visit /search/room for the night/in/Richmond-VIC/
        Then I should be at /search/room for the night/Richmond-VIC

    Scenario: Visit legacy Have your say page
        When I visit /have-your-say
        Then I should be at /advocacy
