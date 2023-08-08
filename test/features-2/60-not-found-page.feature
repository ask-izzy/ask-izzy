Feature: 404 Not found Page

    # As a user
    # When I visit a wrong url
    # I want to be able to see the Ask Izzy 404 error page
    Scenario: Enter a wrong url will be navigated to the Ask Izzy 404 error page
       Given a fresh session
        When I visit /wrong-url
        Then I should see "Page not found"

    Scenario: Enter a wrong service url will be navigated to the Ask Izzy 404 error page
        Given a fresh session
        When I visit /service/817385-common-equity-rental-housing-cooperative-access-cerc/wrong-url
        Then I should see "Page not found"



