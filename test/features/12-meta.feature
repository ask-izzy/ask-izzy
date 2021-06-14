Feature: Meta

    # As a search engine
    # When I come to Ask Izzy
    # I want to know what the page is about
    # So that I can correctly index it

    Background:
        Given my location is "Melbourne, VIC"
        And I have somewhere to sleep tonight
        And my gender is female
        And I am 27 years old
        And I am not looking for any specific housing
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: Visit home page
        When I visit /
        Then the canonical meta is /

    Scenario: Visit Food banks
        When I visit /food-banks
        Then the canonical meta is /food-banks

    Scenario: View search results
        When I visit /search/room for the night
        Then the canonical meta is /search/room for the night

    Scenario: Visit category page
        When I visit /food/Richmond-VIC
        Then the canonical meta is /food/Richmond-VIC
