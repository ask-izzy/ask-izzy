/* @flow */

import { Service } from "../../src/iss";
import { Abn, Id, Merge } from "./Value";
import { Location, Site, TravelTime } from "./Location";
import { NowOpen } from "./OpeningTime";

function defaults() {
    return {
        abn: Abn(),
        accessibility: "access",
        accessibility_details: "",
        accreditation: [],
        adhc_eligible: false,
        adhc_registered: false,
        age_groups: [
            "youngadult",
            "adult",
            "middleagedadult",
        ],

        // FIXME: Can we include the main name in the alias?
        also_known_as: ["Service Alias"],
        assessment_criteria: "",
        availability: "Some",
        billing_method: "",
        cald_specific: true,
        capacity: {
            frequency: 1,
            status: "amber",
            status_text: "",
        },
        catchment: "",
        cost: "",
        crisis: false,
        datasets: {},
        description: "Offers swags and blankets to those sleeping rough.",
        details: "",
        eligibility_info: "",
        emails: [],
        endpoints: [],
        free_or_low_cost: false,
        funding_body: "Department of Human Services (VIC)",
        healthcare_card_holders: false,
        id: Id(),
        indigenous_classification: [],
        ineligibility_info: "",
        intake_info: "",
        intake_point: "",
        is_bulk_billing: true,
        languages: [
            "English",
            "Italian",
        ],
        last_updated: "2015-02-03",
        lgbtiqa_plus_specific: false,
        location: Location(),
        location_expiry: null,
        location_type: "",
        name: "Bare Needs",
        ndis_approved: false,
        networks: [],
        now_open: NowOpen(),
        opening_hours: [],
        parking_info: "",
        phones: [],
        postal_address: [],
        promoted: false,
        public_transport_info: "Near South Yarra station",
        publicly_searchable: true,
        referral_info: "",
        service_types: [],
        show_in_askizzy_health: false,
        site: Site(),
        special_requirements: "",
        statewide: false,
        target_gender: "u",
        type: "service",
        web: "",
        travelTime: TravelTime(),
    };
}

export function ServiceParams(opts: ?Object): issService {
    return Merge(defaults(), opts);
}

export default function ServiceFactory(opts: ?Object): Service {
    return new Service(ServiceParams(opts));
}