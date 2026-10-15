/* eslint-disable camelcase */
import _ from "underscore";
import { slugify } from "underscore.string";
import lo_ from "lodash";

import serviceProvisions from "../constants/service-provisions";
import type {site, SiteProps} from "./site"
import AddressLocation from "./AddressLocation"
import type {
    travelTime,
    openingHours,
    phone,
    email,
    socialMedia,
    language,
} from "./general"
import ServiceOpening from "./ServiceOpening";
import type {SortType} from "../components/base/Dropdown"
import {lookbehindIsSupported} from "@/helpers/regex.helpers"

// The fields we request from ISS when fetching services as part of a search.
// Only fields which are actually used should be included here since every
// extra field slows down the response.
export const SEARCH_RESULT_FIELDS = [
    "id",
    "name",
    "description",
    "is_crisis",
    "open_now",
    "opening_hours",
    "phones",
    "indigenous_classification",
    "is_lgbtiqa_plus_specific",
    "is_ndis_approved",
    "accessibility",
    "catchment",
    "eligibility_info",
    "ineligibility_info",
    "referral_info",
    "special_requirements",
    "location_details",
    "site.id",
    "site.name",
    "site.location",
]

// The fields we request from ISS when fetching a single service to display
// in full.
export const SERVICE_DETAIL_FIELDS = [
    ...SEARCH_RESULT_FIELDS,
    "emails",
    "web",
    "social_media",
    "cost",
    "intake_info",
    "intake_point",
    "languages",
]

// The shape of a service as returned by ISS
export type ServiceProps = Omit<Service, "site"> & {
    site: SiteProps
}

export type IndigenousClassification =
    "specific" | "culturally_safe" | "mainstream_who_cater" | "mainstream"

export default class Service {
    constructor(props: any) {
        const {site, ...remainingProps} = props

        Object.assign(this, remainingProps);

        if (site) {
            this.site = {
                ...site,
                location: site.location ?
                    new AddressLocation({
                        ...site.location,
                        details: props.location_details,
                    })
                    : site.location,
            }
        }
    }

    accessibility?: Array<string> | null;
    catchment?: Array<string> | null;
    cost?: string | null;
    description: string;
    eligibility_info?: string | null;
    emails?: Array<email>;
    id: number;
    indigenous_classification?: IndigenousClassification | null;
    ineligibility_info?: string | null;
    intake_info?: string | null;
    intake_point?: string | null;
    is_crisis: boolean;
    is_lgbtiqa_plus_specific?: boolean;
    is_ndis_approved?: boolean;
    languages?: Array<language>;
    location_details?: string | null;
    name: string;
    open_now?: boolean | null;
    opening_hours: Array<openingHours>;
    phones: Array<phone>;
    referral_info?: string | null;
    site: site;
    special_requirements?: string | null;
    social_media?: Array<socialMedia>;
    web?: string;
    travelTimes: Array<travelTime> | null | undefined;

    _serviceProvisions: Array<string>;

    Phones(): Array<phone> {
        const phoneKinds = ["freecall", "phone", "mobile"];

        return _(_(this.phones
            .filter(({phone_type, confidential}) =>
                phoneKinds.includes(phone_type) && !confidential
            )
            .map(({comment, phone_type, number}) => {
                // 13* lines are not free calls
                if ((phone_type === "freecall") && (number.match(/^13/))) {
                    phone_type = "phone";
                }

                return {
                    comment: (comment || "").trim(),
                    phone_type: (phone_type || "").trim(),
                    number: (number || "").trim(),
                }
            }))
            .sortBy((({phone_type}) => phoneKinds.indexOf(phone_type))))
            .uniq(phone => phone.number);
    }

    Indigenous(): boolean {
        return this.indigenous_classification === "specific" ||
            this.indigenous_classification === "mainstream_who_cater"
    }

    /**
     * The service opening hours
     */
    get open(): (ServiceOpening) {
        return new ServiceOpening({
            open_now: this.open_now,
            opening_hours: this.opening_hours,
            state: this.site?.location?.state,
        });
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
            let regex = /\.\s+(?=\S)/;
            let remainingDescription = this.description;
            const sentences = []
            let match = regex.exec(remainingDescription)
            while (match) {
                const cutIndex = match.index + match?.[0]?.length
                sentences.push(
                    remainingDescription.slice(0, cutIndex)
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
        let sentences = this.descriptionSentences;
        let description = [sentences.shift()];
        let descriptionLength = () =>
            description.reduce((memo, elem) => memo + elem.length, 0);

        while (
            sentences.length &&
            (descriptionLength() + sentences[0].length) < 250
        ) {
            description.push(sentences.shift());
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
            this.shortDescription.length
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
                    orderBy.key && item[orderBy.key][keys[key]]
                )
                const unMatchedResults = results.filter(item =>
                    orderBy.key &&
                    !item[orderBy.key][keys[key]]
                )
                newResults = matchedResults.concat(unMatchedResults)
            }
        } else {
            // Sort through the results
            newResults = results.sort(
                (serviceA: any, serviceB: any) => {
                    const nestedValue = (service: any) => {
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
                        serviceA[orderBy.key]
                    );
                    const bVal = isObject && nestedValue(
                        serviceB[orderBy.key]
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
                orderBy.key && item[orderBy.key]
            )
            const UnMatchedResults = results.filter(item =>
                orderBy.key && !item[orderBy.key]
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
