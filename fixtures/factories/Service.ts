import merge from "deepmerge";

import Service, {ServiceProps} from "@/src/iss/Service";
import type {AddressLocationProps} from "@/src/iss/AddressLocation";
import type {site} from "@/src/iss/site";
import type {nowOpen, phone} from "@/src/iss/general";
import { Abn, Id } from "@/fixtures/factories/Value";
import { getAddressLocationPropsFixture } from "@/fixtures/factories/AddressLocation";
import getSiteFixture from "@/fixtures/factories/site";
import {getNowOpenFixture, getPhoneFixture} from "./general";
import {$Shape} from "utility-types";

export type serviceFixtureProps = $Shape<
    ServiceProps & {
        location: $Shape<AddressLocationProps> | any;
        now_open: $Shape<nowOpen>;
        phones: Array<$Shape<phone>>;
        site: $Shape<site>;
    }
>;

export default function getServiceFixture(
    additionalProps?: serviceFixtureProps,
): Service {
    return new Service(
        getServiceFixtureProps(additionalProps),
    );
}

export function getServiceFixtureProps(
    additionalProps?: serviceFixtureProps,
): ServiceProps {
    const defaultProps = {
        abn: Abn(),
        accessibility: "access",
        accessibility_details: "",
        accreditation: [],
        age_groups: [
            "youngadult",
            "adult",
            "middleagedadult",
        ],
        assessment_criteria: "",
        availability: "Some",
        billing_method: "",
        capacity: {
            frequency: 1,
            status: "amber",
            status_text: "",
        },
        catchment: "",
        cost: "",
        crisis: false,
        description: "Offers swags and blankets to those sleeping rough.",
        eligibility_info: "",
        emails: [],
        funding_body: "Department of Human Services (VIC)",
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
        location: getAddressLocationPropsFixture(),
        name: "Bare Needs",
        ndis_approved: false,
        now_open: getNowOpenFixture(),
        opening_hours: [],
        parking_info: "",
        phones: [],
        postal_address: [],
        public_transport_info: "Near South Yarra station",
        referral_info: "",
        service_types: [],
        show_in_askizzy_health: false,
        site: getSiteFixture(),
        special_requirements: "",
        target_gender: "u",
        type: "service",
        web: "",
    };
    return (merge(
        defaultProps,
        {
            ...additionalProps,
            location: getAddressLocationPropsFixture(
                additionalProps?.location,
            ),
            now_open: getNowOpenFixture(
                additionalProps?.now_open,
            ),
            phones: additionalProps?.phones?.map(props =>
                getPhoneFixture(props),
            ) || [],
            site: getSiteFixture(
                additionalProps?.site,
            ),
        },
    )) as any
}
