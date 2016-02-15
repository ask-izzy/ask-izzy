# Taken from HSNet testing

Feature: Search for legal aid
    Background:
        Given I have deleted all answers

    Scenario: Looking for legal aid in Broken Hill
        Given my location is "Broken Hill, NSW"
        And I am not interested in any subcategory
        Then my results for legal should contain
        ----------------------------------
        - id: 173946
          site:
            name: Aboriginal Legal Service (NSW/ACT), Broken Hill
        - id: 481616
          site:
            name: Child Support Service, Far West
        ----------------------------------
        Then my results for legal would ideally contain
        ----------------------------------
        - id: 545393
          site:
            name: Broken Hill Legal Aid Office
        - id: 517986
          site:
            name: Griffith Neighbourhood House Community Centre
        - id: 173941
          site:
            name: Aboriginal Legal Service (NSW/ACT), Bourke
        - id: 173917
          site:
            name: Aboriginal Legal Service (NSW/ACT), Griffith
        - id: 469663
          site:
            name: Junee Legal Aid Outreach
        - id: 173924
          site:
            name: Binaal Billa Family Violence Prevention Legal Service
        - id: 105199
          site:
            name: Aboriginal Legal Service (NSW/ACT), Wagga Wagga
        - id: 1730295
          site:
            name: Corowa Community Hub, Legal Outreach
        - id: 113479
          site:
            name: Culcairn Rural Transaction Centre (RTC)
        - id: 173948
          site:
            name: Aboriginal Legal Service (NSW/ACT), Walgett
        - id: 110391
          site:
            name: Thiyama-li Family Violence Service, Walgett
        - id: 473292
          site:
            name: Bathurst Legal Aid Outreach
        - id: 200292
          site:
            name: Bathurst Information & Neighbourhood Centre
        - id: 645675
          site:
            name: Aboriginal Legal Service (NSW/ACT), Bathurst
        - id: 481375
          site:
            name: Child Support Service, Central West
        - id: 481631
          site:
            name: Child Support Service, Southern Tablelands
        - id: 469655
          site:
            name: Batemans Bay Legal Aid Outreach
        - id: 469657
          site:
            name: Moruya Legal Aid Outreach
        - id: 173891
          site:
            name: Aboriginal Legal Service (NSW/ACT), Moree
        ----------------------------------
