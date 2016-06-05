# Taken from HSNet testing

Feature: Search for healthcare services
    Background:
        Given I have deleted all answers

    Scenario: Looking for indigenous healthcare in Oberon
        Given my location is "Oberon, NSW"
        And I am not interested in any subcategory
        And I have skipped setting my gender
        And I have skipped setting my age
        And I have answered Yes for indigenous
        Then my results for health would ideally contain
        ----------------------------------
        - id: 575484
          site:
            name: Orange Health Service, Community Health Centre
        - id: 649260
          site:
            name: Hawkesbury District Health Service, Community Health
        - id: 302661
          site:
            name: Bathurst Community Health Centre
        - id: 1090284
          site:
            name: Cowra Health Service, Community Health Centre
        - id: 117157
          site:
            name: Orange Aboriginal Medical Service
        - id: 568886
          site:
            name: Orange Aboriginal Medical Service, Murundhu Dharaa Outreach
        - id: 108967
          site:
            name: Aboriginal Medical Service Western Sydney
        - id: 1789926
          site:
            name: Blacktown Hospital Outpatient Aboriginal Health Liaison Service
        - id: 103493
          site:
            name: Tharawal Aboriginal Corporation
        - id: 539821
          site:
            name: La Perouse Aboriginal Community Health Centre
        - id: 1732144
          site:
            name: Cumnock Community Health Centre
        - id: 1740389
          site:
            name: Nepean-Blue Mountains Medicare Local
        - id: 1060605
          site:
            name: Mingaletta Aboriginal & Torres Strait Islander Corporation
        - id: 263802
          site:
            name: Nowra Community Health Centre
        - id: 1763774
          site:
            name: St George Hospital, Bulbuwil Aboriginal Healthy Lifestyle Program
        - id: 791331
          site:
            name: Royal North Shore Hospital
        - id: 791341
          site:
            name: Northern Sydney Aboriginal Health Service
        - id: 118305
          site:
            name: Illawarra Aboriginal Medical Service, Wollongong
        - id: 94869
          site:
            name: Aboriginal Medical Service Cooperative
        - id: 601062
          site:
            name: Prince of Wales Hospital, Randwick, Prince of Wales Community Health Service
        - id: 118153
          site:
            name: Justice & Forensic Mental Health Network (J&FMHN), Aboriginal Health
        - id: 1796709
          site:
            name: Malabar Community Midwifery Link Service, Aboriginal Family Social Worker
        - id: 1796697
          site:
            name: Malabar Community Midwifery Link Service, Aboriginal Health Education Officer
        - id: 605950
          site:
            name: Waratah Medical Services @ Kanwal
        - id: 449131
          site:
            name: Hazelbrook Pharmacy
        - id: 1793397
          site:
            name: St George Hospital, Community Health Nursing, Kogarah, Aboriginal Health Liaison Officer (AHLO)
        - id: 605949
          site:
            name: Southern Lake Macquarie GP Super Clinic & Waratah Medical Services @ Morisset
        - id: 628214
          site:
            name: Gosford Hospital
        - id: 806852
          site:
            name: Parkes Community Health Service
        - id: 1014186
          site:
            name: Central Coast NSW Medicare Local (CCNSWML), Guri Wagir Aboriginal Health Service
        - id: 109331
          site:
            name: International Centre for Eyecare Education (ICEE)
        ----------------------------------
