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
        capacity: {
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
        funding_body: "Department of Human Services (VIC)",
        healthcare_card_holders: true,
        id: Id(),
        ineligibility_info: "",
        intake_info: "",
        intake_point: "",
        is_bulk_billing: true,
        languages: [
            "English",
            "Italian",
        ],
        last_updated: "2015-02-03",
        location: Location(),
        name: "Bare Needs",
        ndis_approved: false,
        now_open: NowOpen(),
        opening_hours: [],
        parking_info: "",
        phones: [],
        postal_address: [],
        public_transport_info: "Near South Yarra station",
        referral_info: "",
        service_type: [],
        site: Site(),
        special_requirements: "",
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

