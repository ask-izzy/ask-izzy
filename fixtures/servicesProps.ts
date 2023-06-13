import type {serviceFixtureProps} from "@/fixtures/factories/Service.js"

/* eslint-disable max-len */
export const phoneableServiceProps: serviceFixtureProps = {
    id: 5551234,
    name: "Phoneable service",
    description: "",
    site: {id: 333, name: "phoneable"},
    now_open: { now_open: false },
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
            kind: "phone",
            number: "(03) 3333 3333",
        },
        {
            comment: "",
            kind: "fax",
            number: "(03) 5555 5555",
        },
        {
            comment: "",
            kind: "mobile",
            number: "0477 777 777",
        },
        {
            comment: "(really a mobile)",
            kind: "phone",
            number: "0477 777 777",
        },
        {
            comment: "",
            kind: "freecall",
            number: "1300 111 111",
        },
        {
            comment: "",
            kind: "tty",
            number: "(03) 9999 9999",
        },
    ],
    emails: [],
    web: "",
    location: {},
}

export const housingServiceProps: serviceFixtureProps = {
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
    service_types: ["Housing Service"],
    now_open: {
        now_open: false,
    },
    opening_hours: [],
    phones: [],
    emails: [],
    web: "",
    location: {
        suburb: "Richmond",
        point: {
            lat: -37.8228,
            lon: 144.998,
        },
    },
}

export const housingServiceSiblingProps: serviceFixtureProps = {
    id: 112,
    name: "Transitional Housing Service",
    description: "Transitional housing service",
    site: {
        name: "My Housing Service",
        id: 111,
    },
    location: {
        suburb: "Richmond",
        point: {
            lat: -37.8228,
            lon: 144.998,
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
    },
    service_types: ["Accommodation"],
    now_open: {
        now_open: null,
    },
    emails: [],
    opening_hours: [],
    location: {
        suburb: "Richmond",
        point: {
            lat: -37.8237,
            lon: 144.985,
        },
    },
}

export const susansHouseServiceProps: serviceFixtureProps = {
    id: 333,
    name: "Womens Refuge",
    description: "Provides crisis accommodation for women",
    site: {
        id: 334,
        name: "Susan's House",
    },
    service_types: ["Refuge"],
    now_open: {
        now_open: null,
    },
    opening_hours: [],
    location: {
        suburb: "Richmond",
        point: {
            lat: -37.8237,
            lon: 144.985,
        },
    },
}

export const ixaServiceProps: serviceFixtureProps = {
    abn: "",
    accessibility: "noaccess",
    accreditation: [],
    age_groups: [],
    assessment_criteria: "",
    availability: "",
    billing_method: "",
    capacity: {
        frequency: 1,
        status: "expired",
        status_text: "green",
    },
    catchment: "Australia.",
    cost: "",
    crisis: false,
    description: "An Australia-wide listing of over 345,000 records of support services and agencies in the areas of care, disabilities, education, employment, finance, health, housing, law, material aid and recreation.  Information can be sought by a free-text search, with alternative searches by agency name, service name, keyword searching or according to the category or focus of the service.\r\nCustomised directories or data management services using the Infoxchange Service Seeker as the source are also available.",
    eligibility_info: "",
    emails: [
        {
            comment: "",
            email: "database@infoxchange.net.au",
        },
    ],
    funding_body: "Self-funding",
    id: 866464,
    indigenous_classification: ["Mainstream"],
    ineligibility_info: "",
    intake_info: "",
    intake_point: "",
    is_bulk_billing: false,
    languages: [],
    last_updated: "2017-05-10",
    lgbtiqa_plus_specific: false,
    location: {
        building: "",
        details: "",
        flat_unit: "",
        level: "",
        point: {
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
    name: "Infoxchange Service Seeker (ISS) Online Databases",
    ndis_approved: false,
    now_open: {
        local_time: "2020-07-21T19:47:00+10:00",
        notes: "",
        now_open: false,
    },
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
    parking_info: "Street parking available",
    phones: [
        {
            comment: "Service Seeker Manager, Robyn Karlsen",
            kind: "phone",
            number: "(03) 9418 7447",
        },
        {
            comment: "Local call cost",
            kind: "phone",
            number: "1300 306 645",
        },
        {
            comment: "",
            kind: "fax",
            number: "(03) 9486 9344",
        },
    ],
    postal_address: [
        {
            line1: "",
            line2: "",
            postcode: "",
            state: "",
            suburb: "",
        },
    ],
    public_transport_info: "Nearest train station, North Richmond; Bus 246, 250; Tram 24, 109 to stop 19",
    referral_info: "",
    service_types: ["Community Care", "Information or Referral"],
    show_in_askizzy_health: false,
    site: {
        id: 865888,
        name: "Infoxchange",
        organisation: {
            id: 793818,
            name: "Infoxchange",
        },
    },
    special_requirements: "",
    target_gender: "u",
    type: "service",
    web: "http://www.serviceseeker.com.au",
}

export const legalServiceProps: serviceFixtureProps = {
    id: 13841,
    name: "Legal Service",
    description: "A service. Provides free legal advice to people.",
    site: {
        name: "Service.com",
        id: 999,
    },
    catchment: "Carlton",
    eligibility_info: "",
    ineligibility_info: "",
    service_types: ["Legal"],
    now_open: {
        now_open: false,
    },
    opening_hours: [],
    phones: [],
    emails: [],
    web: "",
    location: {
        suburb: "Carlton",
    },
}

export const domesticViolenceServiceProps: serviceFixtureProps = {
    id: 2721562,
    abn: "",
    accessibility: "noaccess",
    accreditation: ["QMS"],
    age_groups: [],
    assessment_criteria: "",
    availability: "According to need; twenty-four hours, seven days a week.",
    billing_method: "",
    capacity: {
        status: "undef",
        status_text: "",
    },
    catchment: "Australia.",
    cost: "Nil.",
    crisis: true,
    description: "Provides free twenty-four hours, seven days a week telephone and online counselling, support and referral for people affected by sexual assault, domestic or family violence in Australia.\r\nOnline counselling can be accessed via www.1800respect.org.au",
    eligibility_info: "",
    emails: [
        {
            comment: "",
            email: "info@rape-dvservices.org.au",
        },
    ],
    funding_body: "Department of Social Services",
    show_in_askizzy_health: false,
    ineligibility_info: "",
    intake_info: "Self referral; availability, 24 hours, 7 days a week.",
    intake_point: "Phone Counsellor, free call: 1800 211 028",
    is_bulk_billing: false,
    languages: [],
    last_updated: "2015-09-01",
    location: {
        point: undefined,
        postcode: "2041",
        state: "NSW",
        suburb: "BALMAIN",
    },
    name: "1800RESPECT",
    ndis_approved: false,
    now_open: {
        local_time: "2021-10-12T18:09:00+11:00",
        notes: "",
        now_open: true,
    },
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
    parking_info: "",
    phones: [
        {
            comment: "Counsellor, free call",
            kind: "phone",
            number: "1800 737 732",
        },
        {
            comment: "Administration",
            kind: "phone",
            number: "(02) 8585 0333",
        },
        {
            comment: "",
            kind: "fax",
            number: "(02) 9555 5911",
        },
        {
            comment: "",
            kind: "freecall",
            number: "1800 737 732",
        },
    ],
    postal_address: [
        {
            line1: "PO Box 555",
            line2: "",
            postcode: "1470",
            state: "NSW",
            suburb: "DRUMMOYNE",
        },
    ],
    public_transport_info: "",
    referral_info: "Self.",
    service_types: ["Counselling"],
    site: {
        id: 125111,
        name: "Rape & Domestic Violence Services Australia",
        organisation: {
            id: 163539,
            name: "Rape & Domestic Violence Services Australia",
        },
    },
    special_requirements: "",
    target_gender: "u",
    type: "service",
    web: "http://www.1800respect.org.au",
}

export const unhelpfulServiceProps: serviceFixtureProps = {
    id: 13844,
    name: "Unhelpful Service",
    description: "Doesn't do a thing",
    site: {
        name: "Unhelpful.com",
        id: 994,
    },
    catchment: "Carlton",
    eligibility_info: "",
    ineligibility_info: "",
    service_types: [],
    now_open: {
        now_open: false,
    },
    opening_hours: [],
    phones: [],
    location: {
        suburb: "Carlton",
    },
}
