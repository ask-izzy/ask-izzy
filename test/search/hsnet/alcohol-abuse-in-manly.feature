# Taken from HSNet testing

Feature: Search for alcohol counselling
    Background:
        Given I have deleted all answers

    Scenario: Alcohol abuse in manly
        Given my location is "Manly, NSW"
        And I need the following for addiction: Alcohol
        Then my results for drugs-alcohol should contain
        ----------------------------------
        - id: 1818376
          crisis: true
          site:
            name: Alcoholics Anonymous (AA), NSW Head Office
        - id: 502664
          site:
            name: Manly Community Centre
        - id: 105653
          site:
            name: Manly Drug Education & Counselling Centre (MDECC)
        - id: 965297
          site:
            name: Queenscliff Community Health Centre
        - id: 111573
          site:
            name: Alcoholics Anonymous (AA), Cremorne
        - id: 109709
          site:
            name: Alcoholics Anonymous (AA), Mosman
        ----------------------------------
        And my results for drugs-alcohol has these services near the end
        ----------------------------------
        - id: 647920
          site:
            name: Royal North Shore Hospital
        - id: 224799
          site:
            name: Alcoholics Anonymous (AA), Neutral Bay
        ----------------------------------
        And my results for drugs-alcohol would ideally contain
        ----------------------------------
        - id: 94317
          crisis: true
          site:
            name: Alcohol & Drug Information Service (ADIS) NSW
        - id: 1173524
          site:
            name: Lower North Shore Community Drug & Alcohol Team
        - id: 106537
          site:
            name: Manly Drug Education & Counselling Centre (MDECC)
        - id: 102935
          site:
            name: Manly Drug Education & Counselling Centre (MDECC)
        - id: 224249
          site:
            name: Alcoholics Anonymous (AA), Manly
        - id: 224253
          site:
            name: Alcoholics Anonymous (AA), Manly/Fairlight
        - id: 392286
          site:
            name: South Pacific Private
        - id: 223980
          site:
            name: Alcoholics Anonymous (AA), Harbord
        - id: 430076
          site:
            name: Phoebe House
        - id: 228198
          site:
            name: Alcoholics Anonymous (AA), Seaforth
        - id: 511112
          site:
            name: Comitato Assistenza Italiani (Co As It) Italian Association of Assistance
        - id: 645178
          site:
            name: Alcoholics Anonymous (AA), Vaucluse
        - id: 634216
          site:
            name: Woy Woy Hospital Community Health Service
        - id: 99593
          site:
            name: Erina Community Health Centre
        - id: 1106457
          site:
            name: Fairfield Drug Health Services
        - id: 1110183
          site:
            name: Frenchs Forest Community Health Centre
        - id: 1145384
          site:
            name: Nepean Hospital Outpatients Department Drug & Alcohol Outpatient Clinic
        - id: 458325
          site:
            name: Nepean Hospital Drug & Alcohol Services
        - id: 649940
          site:
            name: Toukley Community Health Centre
        - id: 650686
          site:
            name: Lakehaven Community Health Centre
        - id: 778845
          site:
            name: Northern Specialist Centre, Royal North Shore Hospital Drug & Alcohol Clinic
        - id: 1789487
          site:
            name: "Long Jetty Community Health Centre, Allied Health Services: Alcohol & Other Drug Service"
        ----------------------------------
