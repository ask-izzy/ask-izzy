Feature: Category/Search page heading

    # As a user
    # When I visit a category
    # I want to know what personalisation settings are present

    Background:
        Given my location is "Richmond VIC"
        And I have somewhere to sleep tonight
        And I need nothing for housing
        And I am not part of any relevant demographics

    Scenario: Female young
        Given my gender is female
        And I am 17 years old
        When I visit /category/housing
        Then I should see "I found 3 housing services for women aged 25 or younger in Richmond, VIC."

    Scenario: Female middle
        Given my gender is female
        And I am 27 years old
        When I visit /category/housing
        Then I should see "I found 3 housing services for women aged 26 to 64 in Richmond, VIC."

    Scenario: Female old
        Given my gender is female
        And I am 77 years old
        When I visit /category/housing
        Then I should see "I found 3 housing services for women aged 65 or older in Richmond, VIC."

    Scenario: Male old
        Given my gender is male
        And I am 77 years old
        When I visit /category/housing
        Then I should see "I found 3 housing services for men aged 65 or older in Richmond, VIC."

    Scenario: No gender old
        Given my gender is Neither/Both/Something else
        And I am 77 years old
        When I visit /category/housing
        Then I should see "I found 3 housing services for people aged 65 or older in Richmond, VIC."