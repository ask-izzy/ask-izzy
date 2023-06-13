/* eslint-disable camelcase */
import _ from "underscore";
import _string from "underscore.string";
const { slugify } = _string;
import lo_ from "lodash";

import serviceProvisions from "@/src/constants/service-provisions.js";
import type {site} from "@/src/iss/site.js"
import AddressLocation, {AddressLocationProps} from "@/src/iss/AddressLocation.js"
import type {
    ymdWithDashesDate,
    travelTime,
    nowOpen,
    postalAddress,
    openingHours,
    phone,
} from "@/src/iss/general.js"
import ServiceOpening from "@/src/iss/ServiceOpening.js";
import type {SortType} from "@/src/components/base/Dropdown.js"
import {getIssClient, getIssVersion} from "@/src/iss/client.js"
import {lookbehindIsSupported} from "@/helpers/regex.helpers.js"

export type ServiceProps = {
    location: AddressLocationProps
} & Service

export default class Service {
    constructor(props: any) {
        const {location, ...remainingProps} = props
        if (location) {
            this.location = new AddressLocation(props.location);
        }

        Object.assign(this, remainingProps);
    }

    abn: string;
    accessibility: "noaccess" | "access" | "fullaccess";
    accessibility_details: string;
    accreditation: Array<string>;
    adhc_eligible: boolean;
    age_groups: Array<ageGroup>;
    assessment_criteria: string;
    availability: string;
    billing_method: string;
    capacity: {
        status: string;
        status_text: string;
        frequency?: number
    };
    catchment: string;
    cost: string;
    crisis: boolean;
    description: string;
    eligibility_info: string;
    emails: Array<{
        comment: string;
        email: string,
    }>;
    funding_body: string;
    show_in_askizzy_health: boolean;
    id: number;
    indigenous_classification: Array<string>;
    ineligibility_info: string;
    intake_info: string;
    intake_point: string;
    is_bulk_billing: boolean;
    languages: Array<string>;
    last_updated: ymdWithDashesDate;
    lgbtiqa_plus_specific: boolean;
    location: AddressLocation;
    name: string;
    ndis_approved: boolean;
    now_open: nowOpen;
    opening_hours: Array<openingHours>;
    parking_info: string;
    phones: Array<phone>;
    postal_address: Array<postalAddress>;
    public_transport_info: string;
    referral_info: string;
    service_types: Array<string>;
    site: site;
    special_requirements: string;
    target_gender: "u" | "f" | "m" | "x";
    type: "organisation" |
        "site" |
        "service" |
        "practitioner";
    web: string;
    travelTimes: travelTime[] | null | undefined;

    _serviceProvisions: Array<string>;
    _explanation: Record<string, unknown>;

    Phones(): Array<phone> {
        const phoneKinds = ["freecall", "phone", "mobile"];

        return _(_(this.phones
            .filter(({kind}) => phoneKinds.includes(kind))
            .map(({comment, kind, number}) => {
                // 13* lines are not free calls
                if ((kind === "freecall") && (number.match(/^13/))) {
                    kind = "phone";
                }

                return {
                    comment: (comment || "").trim(),
                    kind: (kind || "").trim(),
                    number: (number || "").trim(),
                }
            }))
            .sortBy((({kind}) => phoneKinds.indexOf(kind))))
            .uniq(phone => phone.number);
    }

    Indigenous(): boolean {
        if (this.indigenous_classification) {
            const classification = this.indigenous_classification;

            return (
                classification.indexOf(
                    "Mainstream who cater for Aboriginal (indigenous)") > -1 ||
                classification.indexOf("Aboriginal (indigenous) specific") > -1
            )
        }

        return false;

    }


    /**
     * The service opening hours
     */
    get open(): (ServiceOpening) {
        return new ServiceOpening(this);
    }

    /**
     * Splits a description up into an array of sentences.
     *
     * It maintains the text verbatim and doesn't do any cleaning up like
     * removing extra whitespace or add missing full stops. But if there's
     * call for it, it may do some cleaning in future.
     *
     * @returns The description of the service as an array of sentences.
     */
    get descriptionSentences(): Array<string> {
        // Remove this when regex lookbehinds are supported in all browsers we
        // support.
        if (!lookbehindIsSupported()) {
            const regex = /\.\s+(?=\S)/;
            let remainingDescription = this.description;
            const sentences: Array<string> = []
            let match = regex.exec(remainingDescription)
            while (match) {
                const cutIndex = match.index + match?.[0]?.length
                sentences.push(
                    remainingDescription.slice(0, cutIndex),
                )
                remainingDescription = remainingDescription.slice(cutIndex)
                match = regex.exec(remainingDescription)
            }
            if (remainingDescription) {
                sentences.push(remainingDescription)
            }
            return sentences
        }

        // RegEx must be created via a string rather than a literal otherwise
        // it will bork browsers that don't support lookbehinds even if those
        // browsers never execute this line.
        return this.description.split(new RegExp("(?<=\\.\\s+)(?=\\S)", "g"))
    }

    /**
     * First part of the description.
     *
     * Equal to the first sentence + as many remaining sentences as will fit
     * without pushing the length up to or more than 250 characters.
     */
    get shortDescription(): Array<string> {
        const sentences = this.descriptionSentences;
        const description: Array<string> = [sentences.shift() as string];
        const descriptionLength = () =>
            description.reduce(
                (memo, elem) => memo + (elem ? elem.length : 0),
                0,
            )

        while (
            sentences.length &&
            (descriptionLength() + sentences[0].length) < 250
        ) {
            description.push(sentences.shift() as string);
        }

        if (sentences.length > 0) {
            description[description.length - 1] =
                description[description.length - 1].replace(/\.?\s*$/, "…")
        }

        return description;
    }

    /**
     * Rest of the description after the shortDescription.
     */
    get descriptionRemainder(): Array<string> {
        return this.descriptionSentences.slice(
            this.shortDescription.length,
        );
    }

    /**
     * An array of things this service provides built using a bucket-of-words
     * approach from the service's full description */
    get serviceProvisions(): Array<string> {
        if (this._serviceProvisions) {
            return this._serviceProvisions;
        }

        try {

            this._serviceProvisions = serviceProvisions
                .filter((provision) => provision.match(this.description))
                .map(({name}) => name);
        } catch (error) {
            console.error("Failed to determine service provisions")
            console.error(error);
            this._serviceProvisions = [];
        }

        return this._serviceProvisions;
    }

    get slug(): string {
        return slugify(`${this.id}-${this.site.name}`);
    }
}

export type ageGroup = "unspecified" |
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
    "preretirementage" |
    "agedpersons";


export async function getSiblingServices(service: Service): Promise<Service[]> {
    let servicesAtSite: any = []
    const issVersion = getIssVersion()
    if (issVersion === "3") {
        const issClient = await getIssClient(issVersion)

        const result = await issClient.search({
            site_id: service.site.id,
            limit: 100,
        });

        if (!result) {
            // We currently don't worry about if sibling services fail to load
            return []
        }

        servicesAtSite = result.objects
    } else if (issVersion === "4") {
        throw Error("ISS4 not yet supported")
    }

    // Exclude self from services at site
    const siblingServices = servicesAtSite.filter(
        serviceResult => serviceResult.id != service.id,
    )

    return siblingServices.map(service => new Service(service));
}

/**
 * This function will receive a list of
 * search results and a sortObject and based off
 * the sort param it will return a newly ordered list
 * @param results - A list of search results
 * @param orderBy - A search term
 * @returns - An ordered list of services
 */
export const sortServices = (
    results: Array<Service>,
    orderBy: SortType,
): Array<Service> => {
    const isObject = typeof orderBy.value === "object";
    let newResults = results;

    // If the param to be sorted is nested
    // within the service object and not on the top level
    if (isObject) {
        const keys = orderBy.value ? Object.keys(orderBy.value) : [];

        // checks if they type is a boolean
        if (keys.map(item => typeof orderBy.value[item] === "boolean")
            ?.some(val => val)) {

            // Creates two separate lists one that's matched and one
            // that's not then joins them together with matched list first
            for (let key = 0; key < keys.length; key++) {
                const matchedResults = results.filter(item =>
                    orderBy.key && item[orderBy.key][keys[key]],
                )
                const unMatchedResults = results.filter(item =>
                    orderBy.key &&
                    !item[orderBy.key][keys[key]],
                )
                newResults = matchedResults.concat(unMatchedResults)
            }
        } else {
            // Sort through the results
            newResults = results.sort(
                (serviceA, serviceB) => {
                    const nestedValue = (service: Service) => {
                        if (orderBy.value) {
                            const objKeys = Object.keys(orderBy.value);
                            const hasVal = Object.keys(service).map(
                                (key: string) => (objKeys.includes(key) &&
                                    orderBy.value &&
                                    orderBy.value[key] === service[key] &&
                                    service));
                            return hasVal.find(item => item);
                        }
                    }

                    const aVal = isObject && nestedValue(
                        serviceA[orderBy.key],
                    );
                    const bVal = isObject && nestedValue(
                        serviceB[orderBy.key],
                    );
                    if (aVal === bVal) {
                        return 1;
                    } else if (aVal !== bVal) {
                        return -1;
                    }
                    return 0;
                })
        }
    }

    if (!isObject) {
        if (typeof orderBy.value === "boolean") {
            const matchedResults = results.filter(item =>
                orderBy.key && item[orderBy.key],
            )
            const UnMatchedResults = results.filter(item =>
                orderBy.key && !item[orderBy.key],
            )
            newResults = matchedResults.concat(UnMatchedResults)
        } else {
            newResults = lo_.orderBy(results, (item) => {
                return orderBy.key && item[orderBy.key] === orderBy.value;
            }, ["desc"])
        }
    }

    return newResults
}
