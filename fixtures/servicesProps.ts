import type {serviceFixtureProps} from "./factories/Service"

/* eslint-disable max-len */
export const phoneableServiceProps: serviceFixtureProps = {
    id: 5551234,
    name: "Phoneable service",
    description: "",
    site: {
        id: 333,
        name: "phoneable",
        location: {},
    },
    open_now: false,
    opening_hours: [
        {
            close: "17:00:00",
            day: "Monday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "13:00:00",
            day: "Tuesday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "17:00:00",
            day: "Tuesday",
            note: "",
            open: "14:00:00",
        },
        {
            close: "17:00:00",
            day: "Wednesday",
            note: "",
            open: "08:00:00",
        },
        {
            close: "17:00:00",
            day: "Thursday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "17:00:00",
            day: "Friday",
            note: "",
            open: "09:00:00",
        },
    ],
    phones: [
        {
            comment: "",
            phone_type: "phone",
            number: "(03) 3333 3333",
        },
        {
            comment: "",
            phone_type: "fax",
            number: "(03) 5555 5555",
        },
        {
            comment: "",
            phone_type: "mobile",
            number: "0477 777 777",
        },
        {
            comment: "really a mobile",
            phone_type: "phone",
            number: "0477 777 777",
        },
        {
            comment: "",
            phone_type: "freecall",
            number: "1300 111 111",
        },
        {
            comment: "",
            phone_type: "tty",
            number: "(03) 9999 9999",
        },
    ],
    emails: [],
    web: "",
}

export const housingServiceProps: serviceFixtureProps = {
    id: 111,
    name: "Housing Service",
    site: {
        name: "My Housing Service",
        id: 111,
        location: {
            suburb: "Richmond",
            geo_point: {
                lat: -37.8228,
                lon: 144.998,
            },
        },
    },
    description: "A housing service for people.",
    catchment: ["VIC;Carlton"],
    eligibility_info: "",
    ineligibility_info: "",
    open_now: false,
    opening_hours: [],
    phones: [],
    emails: [],
    web: "",
}

export const housingServiceSiblingProps: serviceFixtureProps = {
    id: 112,
    name: "Transitional Housing Service",
    description: "Transitional housing service",
    site: {
        name: "My Housing Service",
        id: 111,
        location: {
            suburb: "Richmond",
            geo_point: {
                lat: -37.8228,
                lon: 144.998,
            },
        },
    },
}

export const youthSupportNetServiceProps: serviceFixtureProps = {
    id: 222,
    name: "Emergency Accom",
    description: "A place to stay if you need it. Open to all u25",
    site: {
        id: 335,
        name: "Youth Support Net",
        location: {
            suburb: "Richmond",
            geo_point: {
                lat: -37.8237,
                lon: 144.985,
            },
        },
    },
    open_now: null,
    emails: [],
    opening_hours: [],
}

export const susansHouseServiceProps: serviceFixtureProps = {
    id: 333,
    name: "Womens Refuge",
    description: "Provides crisis accommodation for women",
    site: {
        id: 334,
        name: "Susan's House",
        location: {
            suburb: "Richmond",
            geo_point: {
                lat: -37.8237,
                lon: 144.985,
            },
        },
    },
    open_now: null,
    opening_hours: [],
}

export const ixaServiceProps: serviceFixtureProps = {
    accessibility: ["noaccess"],
    catchment: ["Australia"],
    cost: "",
    is_crisis: false,
    description: "An Australia-wide listing of over 345,000 records of support services and agencies in the areas of care, disabilities, education, employment, finance, health, housing, law, material aid and recreation.  Information can be sought by a free-text search, with alternative searches by agency name, service name, keyword searching or according to the category or focus of the service.\r\nCustomised directories or data management services using the Infoxchange Service Seeker as the source are also available.",
    eligibility_info: "",
    emails: [
        {
            comment: "",
            email: "database@infoxchange.net.au",
        },
    ],
    id: 866464,
    indigenous_classification: "mainstream",
    ineligibility_info: "",
    intake_info: "",
    intake_point: "",
    languages: [],
    is_lgbtiqa_plus_specific: false,
    name: "Infoxchange Service Seeker (ISS) Online Databases",
    is_ndis_approved: false,
    open_now: false,
    opening_hours: [
        {
            close: "17:00:00",
            day: "Monday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "17:00:00",
            day: "Tuesday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "17:00:00",
            day: "Wednesday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "17:00:00",
            day: "Thursday",
            note: "",
            open: "09:00:00",
        },
        {
            close: "17:00:00",
            day: "Friday",
            note: "",
            open: "09:00:00",
        },
    ],
    phones: [
        {
            comment: "Service Seeker Manager, Robyn Karlsen",
            phone_type: "phone",
            number: "(03) 9418 7447",
        },
        {
            comment: "Local call cost",
            phone_type: "phone",
            number: "1300 306 645",
        },
        {
            comment: "",
            phone_type: "fax",
            number: "(03) 9486 9344",
        },
    ],
    referral_info: "",
    site: {
        id: 865888,
        name: "Infoxchange",
        location: {
            building_name: "",
            flat_unit: "",
            floor_level: "",
            geo_point: {
                lat: -37.810933,
                lon: 144.99282400000004,
            },
            postcode: "3121",
            state: "VIC",
            street_name: "Elizabeth",
            street_number: "33",
            street_suffix: "",
            street_type: "Street",
            suburb: "RICHMOND",
        },
    },
    special_requirements: "",
    web: "http://www.serviceseeker.com.au",
}

export const legalServiceProps: serviceFixtureProps = {
    id: 13841,
    name: "Legal Service",
    description: "A service. Provides free legal advice to people.",
    site: {
        name: "Service.com",
        id: 999,
        location: {
            suburb: "Carlton",
        },
    },
    catchment: ["VIC;Carlton"],
    eligibility_info: "",
    ineligibility_info: "",
    open_now: false,
    opening_hours: [],
    phones: [],
    emails: [],
    web: "",
}

export const domesticViolenceServiceProps: serviceFixtureProps = {
    id: 2721562,
    accessibility: ["noaccess"],
    catchment: ["Australia"],
    cost: "Nil.",
    is_crisis: true,
    description: "Provides free twenty-four hours, seven days a week telephone and online counselling, support and referral for people affected by sexual assault, domestic or family violence in Australia.\r\nOnline counselling can be accessed via www.1800respect.org.au",
    eligibility_info: "",
    emails: [
        {
            comment: "",
            email: "info@rape-dvservices.org.au",
        },
    ],
    ineligibility_info: "",
    intake_info: "Self referral; availability, 24 hours, 7 days a week.",
    intake_point: "Phone Counsellor, free call: 1800 211 028",
    languages: [],
    name: "1800RESPECT",
    is_ndis_approved: false,
    open_now: true,
    opening_hours: [
        {
            close: "00:00:00",
            day: "Monday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Tuesday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Wednesday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Thursday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Friday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Saturday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Sunday",
            note: "",
            open: "00:00:00",
        },
        {
            close: "00:00:00",
            day: "Public Holiday",
            note: "",
            open: "00:00:00",
        },
    ],
    phones: [
        {
            comment: "Counsellor, free call",
            phone_type: "phone",
            number: "1800 737 732",
        },
        {
            comment: "Administration",
            phone_type: "phone",
            number: "(02) 8585 0333",
        },
        {
            comment: "",
            phone_type: "fax",
            number: "(02) 9555 5911",
        },
        {
            comment: "",
            phone_type: "freecall",
            number: "1800 737 732",
        },
    ],
    referral_info: "Self.",
    site: {
        id: 125111,
        name: "Rape & Domestic Violence Services Australia",
        location: {
            geo_point: null,
            postcode: "2041",
            state: "NSW",
            suburb: "BALMAIN",
        },
    },
    special_requirements: "",
    web: "http://www.1800respect.org.au",
}

export const unhelpfulServiceProps: serviceFixtureProps = {
    id: 13844,
    name: "Unhelpful Service",
    description: "Doesn't do a thing",
    site: {
        name: "Unhelpful.com",
        id: 994,
        location: {
            suburb: "Carlton",
        },
    },
    catchment: ["VIC;Carlton"],
    eligibility_info: "",
    ineligibility_info: "",
    open_now: false,
    opening_hours: [],
    phones: [],
}
