/* @flow */

import { Service } from "../../src/iss";
import { Abn, Email, Url, Id, Merge } from "./Value";
import { Location, Site, PostalAddress } from "./Location";
import { NowOpen, OpeningHours } from "./OpeningTime";
import { Phone } from "./Phone";

export function ServiceParams(opts: ?Object) {
    return Merge(defaults(), opts);
}

export default function ServiceFactory(opts: ?Object) {
    return new Service(ServiceParams(opts));
}

function defaults() {
    return {
        abn: Abn(),
        accessibility: "access",
        accessibility_details: "",
        accreditation: [],
        age_groups: [
            "youngadult",
            "adult",
            "middleageadult",
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
        description: "Offers swags and blankets to those sleeping rough.",
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
        service_types: [],
        site: Site(),
        special_requirements: "",
        target_gender: 'u',
        type: "service",
        web: "",
    };
};
