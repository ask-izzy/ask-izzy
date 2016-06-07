# Taken from HSNet testing

Feature: Search for drugs/alcohol help
    Background:
        Given I have deleted all answers
        And I have answered No for indigenous

    Scenario: Addiction in Mt Druitt
        Given my location is "Mount Druitt, NSW"
        And I am not interested in any subcategory
        Then my results for drugs-alcohol should contain
        ----------------------------------
        - id: 369282
          site:
            name: headspace, Mount Druitt
        - id: 224793
          site:
            name: Alcoholics Anonymous (AA), Mt Druitt
        ----------------------------------
        And my results for drugs-alcohol would ideally contain
        ----------------------------------
        - id: 264379
          site:
            name: Aboriginal Catholic Social Services
        - id: 106719
          site:
            name: Marrin Weejali Aboriginal Corporation
        - id: 951359
          site:
            name: St Marys Community Health Centre
        - id: 111493
          site:
            name: Alcoholics Anonymous (AA), Emerton
        - id: 643848
          site:
            name: Alcoholics Anonymous (AA), Blackett
        - id: 111505
          site:
            name: Alcoholics Anonymous (AA), Berrigan
        - id: 1818376
          crisis: true
          site:
            name: Alcoholics Anonymous (AA), NSW Head Office
        - id: 94317
          crisis: true
          site:
            name: Alcohol & Drug Information Service (ADIS) NSW
        - id: 135003
          crisis: true
          site:
            name: Family Drug Support
        - id: 214421
          site:
            name: Aboriginal Medical Service Western Sydney
        - id: 976452
          site:
            name: St Marys Community Health Centre, Alcohol & Other Drug (AOD) Counselling
        - id: 376143
          site:
            name: Alcoholics Anonymous (AA), Lyons
        - id: 376140
          site:
            name: Alcoholics Anonymous (AA), Kippax
        - id: 458325
          site:
            name: Nepean Hospital Drug & Alcohol Services
        - id: 228232
          site:
            name: Alcoholics Anonymous (AA), St Marys
        - id: 1145384
          site:
            name: Nepean Hospital Outpatients Department Drug & Alcohol Outpatient Clinic
        - id: 103469
          site:
            name: Alcoholics Anonymous (AA), Rooty Hill & Doonside
        - id: 511112
          site:
            name: Comitato Assistenza Italiani (Co As It) Italian Association of Assistance
        - id: 647920
          site:
            name: Royal North Shore Hospital
        - id: 392286
          site:
            name: South Pacific Private
        - id: 965297
          site:
            name: Queenscliff Community Health Centre
        - id: 502664
          site:
            name: Manly Community Centre
        - id: 1106457
          site:
            name: Fairfield Drug Health Services
        - id: 1165183
          site:
            name: Concord Hospital Drug & Alcohol Service, Building 73 Outpatient Unit
        - id: 634216
          site:
            name: Woy Woy Hospital Community Health Service
        - id: 643851
          site:
            name: Alcoholics Anonymous (AA), Claremont Meadows
        - id: 475297
          site:
            name: Wollondilly Community Health Centre
        - id: 430076
          site:
            name: Phoebe House
        - id: 99593
          site:
            name: Erina Community Health Centre
        - id: 1764234
          site:
            name: Blacktown Community Health Centre, Drug & Alcohol Counselling Service
        - id: 1731480
          site:
            name: Blacktown Hospital Outpatient Alcohol & Other Drug Unit
        ----------------------------------
