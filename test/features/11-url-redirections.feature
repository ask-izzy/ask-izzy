Feature: Landing page

    # As a user
    # When I come to Ask Izzy using old URLs
    # I want to be redirected to the right pages
    # So that I can view the contents of my saved URLs

    Background:
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Search for "room for the night" at Richmond, VIC
        When I visit /search/room for the night/in/Richmond-VIC/
        Then I should be at /search/room for the night/Richmond-VIC

    Scenario: Visit legacy Have your say page
        When I visit /have-your-say
        Then I should be at /advocacy
