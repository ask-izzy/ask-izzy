Feature: Content

    # As a user
    # When I visit a category
    # I want to see curated content
    # So that I can make informed decisions

    Background:
        Given my location is "Melbourne, VIC"
        And I am not part of any relevant demographics
        And I am not interested in any subcategory

    Scenario: View money help
        When I visit /covid-19-support/money
        Then I should see "Key Information"
        Then I should see "Support services"
        Then I should see "Free calculators, tips and guidance"
        Then I should see "By moneysmart.gov.au"
        Then I should see "Here you'll find out about the major changes banks have introduced to help customers through this difficult time."
