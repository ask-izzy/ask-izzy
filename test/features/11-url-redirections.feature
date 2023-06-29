Feature: URL redirections

    # As a user
    # When I come to Ask Izzy using old URLs
    # I want to be redirected to the right pages
    # So that I can view the contents of my saved URLs

    Background:
        Given the area to search is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I need help for myself
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Visit Housing page
        When I visit /category/housing/
        Then I should be at /housing/Melbourne-VIC

    Scenario: Visit Housing page with location
        When I visit /category/housing/in/Sydney-NSW
        Then I should be at /housing/Sydney-NSW

    Scenario: Visit Everyday needs page
        When I visit /category/everyday-needs
        Then I should be at /everyday-needs/Melbourne-VIC

    Scenario: Visit Everyday needs page with location
        When I visit /category/everyday-needs/in/Sydney-NSW
        Then I should be at /everyday-needs/Sydney-NSW

    Scenario: Search for "room for the night" at Richmond, VIC
        When I visit /search/room for the night/in/Richmond-VIC/
        Then I should be at /search/room for the night/Richmond-VIC

    Scenario: Visit legacy Have your say page
        When I visit /have-your-say
        Then I should be at /advice-and-advocacy/Melbourne-VIC
