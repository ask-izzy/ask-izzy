# Taken from HSNet testing

Feature: Search for housing services
    Background:
        Given I have deleted all answers

    Scenario: Escaping family violence in Broken Hill
        Given my location is "Broken Hill, NSW"
        And I have nowhere to sleep tonight
        And I am 30 years old
        And I am part of the following demographics
        --------------------------------------
        Escaping family violence
        --------------------------------------
        And I am not interested in any subcategory

        Then my results for housing should contain
        ----------------------------------
        - id: 605690
          crisis: true
          site:
            name: NSW Community Services (formerly DoCS), NSW Domestic Violence Line
        - id: 539077
          site:
            name: Wilcannia Women's Refuge
        ----------------------------------
        And my results for housing would ideally contain
        - id: 134721
          crisis: false
          site:
            name: Catherine Haven Women's Refuge
        - id: 135236
          site:
            name: Kulkuna Cottage Women's Refuge
        - id: 536697
          site:
            name: Bourke Women & Children's Safe House
        - id: 1020781
          site:
            name: Kulkuna Cottage Women's Refuge
        - id: 567089
          site:
            name: Kulkuna Cottage Women's Refuge
        - id: 567104
          site:
            name: Kulkuna Cottage Women's Refuge
        - id: 136651
          site:
            name: Forbes Women's Refuge
        - id: 1033519
          site:
            name: Forbes Women's Refuge
        - id: 1033533
          site:
            name: Forbes Women's Refuge
        - id: 1015852
          site:
            name: Betty's Place Women's Refuge
        - id: 423533
          site:
            name: Wagga Wagga Women & Children's Refuge
        - id: 535901
          site:
            name: Barwon Cottage, Women's & Children's Refuge
        - id: 169437
          site:
            name: Louisa Women's Refuge
        - id: 537923
          site:
            name: Moree Women's Refuge, Ngala House
        - id: 102447
          site:
            name: Essie Women's Refuge
        - id: 99913
          site:
            name: Marcia Women's Refuge
        - id: 101683
          site:
            name: Pam's Place Crisis Accommodation Resource & Referral Service
        - id: 376030
          site:
            name: Pathways Community Care
        - id: 134675
          site:
            name: Bonnie Support Services
        - id: 137033
          site:
            name: Wollongong Women's Refuge
        - id: 14919
          site:
            name: Salvation Army Women's Refuge, Carinya Cottage
        - id: 135295
          site:
            name: Lotus House
        - id: 384488
          site:
            name: Bega Women's Refuge
        - id: 100289
          site:
            name: Erin's Place
        ----------------------------------
