/* jscs:disable */
module.exports = {
    housingService: {
        id: 111,
        name: "Housing Service",
        site: {
            name: "My Housing Service",
            id: 111,
        },
        description: "A housing service for people.",
        catchment: "Carlton",
        eligibility_info: "",
        ineligibility_info: "",
        service_types: ['Housing Service'],
        now_open: {
            now_open: false,
        },
        opening_hours: [],
        phones: [],
        location: {
            suburb: 'Richmond',
        },
    },
    housingServiceSibling: {
        id: 112,
        name: "Transitional Housing Service",
        location: {
            suburb: 'Richmond',
        },
    },
    youthSupportNet: {
        id: 222,
        name: "Emergency Accom",
        site: {
            name: "Youth Support Net",
        },
        service_types: ['Accommodation'],
        now_open: {
            now_open: true,
        },
        opening_hours: [],
        location: {
            suburb: 'Richmond',
        },
    },
    susansHouse: {
        id: 333,
        name: "Womens Refuge",
        site: {
            name: "Susan's House",
        },
        service_types: ['Refuge'],
        now_open: {
            now_open: true,
        },
        opening_hours: [],
        location: {
            suburb: 'Richmond',
        },
    },
    ixa: {
        "abn": "",
        "accessibility": "noaccess",
        "accessibility_details": "",
        "accreditation": [],
        "age_groups": [],
        "also_known_as": [],
        "assessment_criteria": "",
        "availability": "",
        "billing_method": "",
        "capacity": {
            "status": "undef",
            "status_text": ""
        },
        "catchment": "Australia.",
        "cost": "",
        "crisis": false,
        "datasets": {
            "ISS VIC": {
                "appears": true,
                "external_id": "30879"
            }
        },
        "description": "An Australia-wide listing of over 340,000 records of support services and agencies in the areas of care, disabilities, education, employment, finance, health, housing, law, material aid and recreation.  Information can be sought by a free-text search, with alternative searches by agency name, service name, keyword searching or according to the category or focus of the service.\r\nA real-time accommodation vacancy register and a respite planner are also available.  The vacancies on these registers are updated directly by the agency providing the service.\r\nCustomised directories or data management services using the Infoxchange Service Seeker as the source are also available.",
        "eligibility_info": "",
        "emails": [
            {
                "comment": "",
                "email": "database@infoxchange.net.au"
            }
        ],
        "endpoints": [
            {
                "description": "",
                "forms": [
                    "hsnet"
                ],
                "priority": 10,
                "scheme": "s2x+https",
                "uri": "s2x+https://s2x-staging.infoxchangeapps.net.au/api/v1/service/866464/"
            }
        ],
        "funding_body": "Self-funding",
        "healthcare_card_holders": false,
        "id": 866464,
        "ineligibility_info": "",
        "intake_info": "",
        "intake_point": "",
        "is_bulk_billing": false,
        "languages": [],
        "last_updated": "2015-04-16",
        "location": {
            "building": "",
            "flat_unit": "",
            "level": "",
            "point": {
                "lat": -37.800753,
                "lon": 145.000404
            },
            "postcode": "3121",
            "state": "VIC",
            "street_name": "Elizabeth",
            "street_number": "33",
            "street_suffix": "",
            "street_type": "Street",
            "suburb": "RICHMOND"
        },
        "name": "Infoxchange Service Seeker (ISS) Online Databases",
        "ndis_approved": false,
        "now_open": {
            "local_time": "11:02:00",
            "notes": "",
            "now_open": true
        },
        "opening_hours": [
            {
                "close": "17:00:00",
                "day": "Monday",
                "note": "",
                "open": "09:00:00"
            },
            {
                "close": "17:00:00",
                "day": "Tuesday",
                "note": "",
                "open": "09:00:00"
            },
            {
                "close": "17:00:00",
                "day": "Tuesday",
                "note": "",
                "open": "09:00:00"
            },
            {
                "close": "17:00:00",
                "day": "Wednesday",
                "note": "",
                "open": "09:00:00"
            },
            {
                "close": "17:00:00",
                "day": "Wednesday",
                "note": "",
                "open": "09:00:00"
            },
            {
                "close": "17:00:00",
                "day": "Thursday",
                "note": "",
                "open": "09:00:00"
            },
            {
                "close": "17:00:00",
                "day": "Friday",
                "note": "",
                "open": "09:00:00"
            }
        ],
        "parking_info": "Street parking available",
        "phones": [
            {
                "comment": "Service Seeker Manager, Robyn Karlsen",
                "kind": "phone",
                "number": "(03) 9418 7447"
            },
            {
                "comment": "Local call cost",
                "kind": "phone",
                "number": "1300 306 645"
            },
            {
                "comment": "",
                "kind": "fax",
                "number": "(03) 9486 9344"
            },
            {
                "comment": "",
                "kind": "fax",
                "number": "(03) 9486 9344"
            }
        ],
        "postal_address": [
            {
                "line1": "",
                "line2": "",
                "postcode": "",
                "state": "",
                "suburb": ""
            }
        ],
        "public_transport_info": "Nearest train station, North Richmond; Bus 246, 250; Tram 24, 109 to stop 19",
        "referral_info": "",
        "service_types": [],
        "site": {
            "id": 865888,
            "name": "Infoxchange",
            "organisation": {
                "id": 793818,
                "name": "Infoxchange"
            }
        },
        "special_requirements": "",
        "target_gender": "u",
        "type": "service",
        "web": "http://www.serviceseeker.com.au"
    },
}
