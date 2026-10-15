import merge from "deepmerge";

import Service from "../../src/iss/Service";
import type {ServiceProps} from "../../src/iss/Service";
import type {phone} from "../../src/iss/general";
import { Id } from "./Value";
import getSiteFixture from "./site";
import type {siteFixtureProps} from "./site";
import {getPhoneFixture} from "./general";

export type serviceFixtureProps = Partial<Omit<ServiceProps, "phones" | "site"> & {
    phones: Array<Partial<phone>>,
    site: siteFixtureProps,
}>

export default function getServiceFixture(
    additionalProps?: serviceFixtureProps
): Service {
    return new Service(
        getServiceFixtureProps(additionalProps)
    );
}

export function getServiceFixtureProps(
    additionalProps?: serviceFixtureProps
): ServiceProps {
    const defaultProps = {
        accessibility: ["access"],
        catchment: [],
        cost: "",
        description: "Offers swags and blankets to those sleeping rough.",
        eligibility_info: "",
        emails: [],
        id: Id(),
        indigenous_classification: "mainstream",
        ineligibility_info: "",
        intake_info: "",
        intake_point: "",
        is_crisis: false,
        is_lgbtiqa_plus_specific: false,
        is_ndis_approved: false,
        languages: [
            {id: 105, name: "Italian"},
        ],
        location_details: "",
        name: "Bare Needs",
        open_now: true,
        opening_hours: [],
        phones: [],
        referral_info: "",
        site: getSiteFixture(),
        social_media: [],
        special_requirements: "",
        web: "",
    };
    return merge(
        defaultProps,
        {
            ...additionalProps,
            phones: additionalProps?.phones?.map(props =>
                getPhoneFixture(props)
            ) || [],
            site: getSiteFixture(
                additionalProps?.site
            ),
        },
        // Arrays given in additionalProps should replace the defaults
        // rather than being appended to them.
        {arrayMerge: (destinationArray, sourceArray) => sourceArray}
    ) as ServiceProps
}
