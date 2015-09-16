
type email = string;
type issAgeGroup = string; /* enum(
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
    "middleageadult" |
    "preretirementage"
) */
type issAccessibility = string; /* enum(
    "noaccess" |
    "access" |
    "fullaccess"
) */
type endpoint = {};
type ymdWithDashesDate = string;
type hmsWithColonsTime = string;
type state = string; /* enum */
type dayOfWeek = string; /* enum('Monday', 'Friday', etc) */
type issOpeningHours = {
    "close": hmsWithColonsTime,
    "day": dayOfWeek,
    "note": string,
    "open": hmsWithColonsTime,
};
type phone = {
    "comment": string,
    "kind": string,
    "number": string,
}
type issGender = string; /* enum('u', 'f', 'm', 'x') */

type issEntityType = string; /* enum(
    'organisation' |
    'site' |
    'service' |
    'practitioner'
) */
type urlString = string;

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
    "crisis": Boolean,
    "description": string,
    "eligibility_info": string,
    "emails": Array<{
        "comment": string,
        "email": email
    }>,
    "endpoints": Array<endpoint>,
    "funding_body": string,
    "healthcare_card_holders": Boolean,
    "id": number,
    "ineligibility_info": string,
    "intake_info": string,
    "intake_point": string,
    "is_bulk_billing": Boolean,
    "languages": Array<string>,
    "last_updated": ymdWithDashesDate,
    "location": {
        "building": string,
        "flat_unit": string,
        "level": string,
        "point": {
            "lat": number,
            "lon": number
        },
        "postcode": string,
        "state": state,
        "street_name": string,
        "street_number": string,
        "street_suffix": string,
        "street_type": string,
        "suburb": string
    },
    "name": string,
    "ndis_approved": Boolean,
    "now_open": {
        "local_time": hmsWithColonsTime,
        "notes": string,
        "now_open": boolean
    },
    "opening_hours": issOpeningHours,
    "parking_info": string,
    "phones": Array<phone>,
    "postal_address": Array<{
        "line1": string,
        "line2": string,
        "postcode": string,
        "state": state,
        "suburb": string
    }>,
    "public_transport_info": string,
    "referral_info": string,
    "service_types": Array<string>,
    "site": {
        "id": number,
        "name": string,
        "organisation": {
            "id": number,
            "name": string
        }
    },
    "special_requirements": string,
    "target_gender": issGender,
    "type": issEntityType,
    "web": urlString,
}
