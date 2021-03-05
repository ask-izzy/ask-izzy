/* @flow */

type issArea = {
    "name": string,
    "kind": string,
    "postcode": string,
    "state": string,
    "suburb": string,
};

type email = string;
type issAgeGroup = "unspecified" |
    "prenatal" |
    "baby" |
    "toddler" |
    "preschool" |
    "schoolage" |
    "earlyadolescent" |
    "midadolescent" |
    "lateadolescent" |
    "youngadult" |
    "adult" |
    "middleagedadult" |
    "preretirementage";

type issAccessibility = "noaccess" |
    "access" |
    "fullaccess";

type endpoint = {};
type ymdWithDashesDate = string;
type hmsWithColonsTime = string;
type isoDateAndTime = string;
type state = string;
type dayOfWeek = 'Monday' |
    'Tuesday' |
    'Wednesday' |
    'Thursday' |
    'Friday' |
    'Saturday' |
    'Sunday';

type issPoint = {
    "lat": number,
    "lon": number
};

type issLocation = {
    "building": string,
    "flat_unit": string,
    "level": string,
    "point"?: issPoint,
    "postcode": string,
    "state": state,
    "street_name": string,
    "street_number": string,
    "street_suffix": string,
    "street_type": string,
    "suburb": string,
};
type travelTime = {
    "duration": {"text": string, "value": number},
    "distance": {"text": string, "value": number},
    "mode": string,
    "status": string,
};
type issSite = {
    "id": number,
    "name": string,
    "organisation": {
        "id": number,
        "name": string
    }
};
type issOpeningHours = {
    "close": hmsWithColonsTime,
    "day": dayOfWeek,
    "note"?: string,
    "open": hmsWithColonsTime,
};
type phone = {
    "comment": string,
    "kind": string,
    "number": string,
}
type issGender = 'u' | 'f' | 'm' | 'x';

type issPostalAddress = {
    "line1": string,
    "line2": string,
    "postcode": string,
    "state": state,
    "suburb": string
};

type issEntityType = 'organisation' |
    'site' |
    'service' |
    'practitioner';

type urlString = string;
type issNowOpen = {
    "local_time": isoDateAndTime,
    "notes": string,
    "now_open": ?boolean
};
type issEmail = {
    "comment": string,
    "email": email
};
type issService = {
    "abn": string,
    "accessibility": issAccessibility,
    "accessibility_details": string,
    "accreditation": Array<string>,
    "age_groups": Array<issAgeGroup>,
    "also_known_as": Array<string>,
    "assessment_criteria": string,
    "availability": string,
    "billing_method": string,
    "capacity": {
        "status": string,
        "status_text": string,
    },
    "catchment": string,
    "cost": string,
    "crisis": boolean,
    "description": string,
    "eligibility_info": string,
    "emails": Array<issEmail>,
    "endpoints": Array<endpoint>,
    "funding_body": string,
    "show_in_askizzy_health": boolean,
    "id": number,
    "ineligibility_info": string,
    "intake_info": string,
    "intake_point": string,
    "is_bulk_billing": boolean,
    "languages": Array<string>,
    "last_updated": ymdWithDashesDate,
    "location": ?issLocation,
    "name": string,
    "ndis_approved": boolean,
    "now_open": issNowOpen,
    "opening_hours": Array<issOpeningHours>,
    "parking_info": string,
    "phones": Array<phone>,
    "postal_address": Array<issPostalAddress>,
    "public_transport_info": string,
    "referral_info": string,
    "service_type": Array<string>,
    "site": issSite,
    "special_requirements": string,
    "target_gender": issGender,
    "type": issEntityType,
    "web": urlString,
}
