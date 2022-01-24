/* @flow */
/* eslint-disable camelcase */
import _ from "underscore";
import { slugify } from "underscore.string";
import lo_ from "lodash";

import serviceProvisions from "../constants/service-provisions";
import type {site} from "./site"
import AddressLocation from "./AddressLocation"
import type {AddressLocationProps} from "./AddressLocation"
import type {
    ymdWithDashesDate,
    travelTime,
    nowOpen,
    postalAddress,
    openingHours,
    phone,
    geoPoint,
} from "./general.js"
import ServiceOpening from "./ServiceOpening";
import {
    getServiceFromCache,
    forEachServiceFromCache,
} from "./serviceSearch"
import {searchForServices} from "./serviceSearch"
import {jsonRequestFromIss} from "./request"
import type {
    serviceSearchResults,
    serviceSearchRequest,
} from "./serviceSearch"
import Maps from "../maps";
import {
    Timeout,
    TryWithDefault,
} from "../timeout";
import type {SortType} from "../components/base/Dropdown"
import {getIssClient} from "./client"

export type ServiceProps = {
    ...Service,
    location: AddressLocationProps
}

export default class Service {
    constructor(props: ServiceProps) {
        this.location = new AddressLocation(props.site)

        Object.assign(this, props);
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
    location: ?AddressLocation;
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
    target_gender: 'u' | 'f' | 'm' | 'x';
    type: 'organisation' |
        'site' |
        'service' |
        'practitioner';
    web: string;
    travelTimes: ?Array<travelTime>;

    _serviceProvisions: Array<string>;
    _siblingServices: serviceSearchResults;
    _explanation: Object;

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
            let classification = this.indigenous_classification;

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

        function lookbehindIsSupported() {
            try {
                return !!(
                "text-test1-behind-test2-test3"
                    .match(
                        new RegExp("(?<=behind)-test\\d", "g")
                    )?.[0] === "-test2" &&
                "behind-test1-test2"
                    .match(
                        new RegExp("(?<!behind)-test\\d", "g")
                    )?.[0] === "-test2"
                );
            } catch (error) {
                return false;
            }
        }
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

    async getSiblingServices(): Promise<serviceSearchResults> {
        if (this._siblingServices) {
            return this._siblingServices;
        }

        // limit should be 0 - see
        // https://redmine.office.infoxchange.net.au/issues/112476
        let request_: serviceSearchRequest = {
            site_id: this.site.id,
            type: "service",
            limit: 100,
        };
        let {services, meta} = await searchForServices(
            "/api/v3/search/",
            request_
        );

        // Don't mutate what comes back from
        // requestObjects - the objects are cached!
        this._siblingServices = {
            meta,
            services: services.filter(service => service.id != this.id),
        };

        return this._siblingServices;
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
    "preretirementage";

/*
* Loads the transportTime property from google
* and adds it to the given Service instances
*/
export async function attachTransportTimes(
    services: Array<Service>
): Promise<Array<Service>> {
    if (typeof window === "undefined") {
        // Google maps api doesn't work outside the browser.
        return services;
    }

    let formatPoint = (point: geoPoint) => `${point.lat},${point.lon}`;

    const maps = await TryWithDefault < $ReadOnly < {travelTime: Function} >>(
        1000, Maps(), {}
    );

    if (typeof maps.travelTime === "function") {
        const servicesToLoadTravelTimesFor = services.filter(
            service => !service.location?.isConfidential()
        )
        console.log('&&&', servicesToLoadTravelTimesFor)
        const travelTimesForServices = await Timeout(
            3000,
            maps.travelTime(servicesToLoadTravelTimesFor
                // $FlowIgnore isConfidential checks location.point
                .map(({location}) => formatPoint(location.point))
            )
        );

        for (const service of servicesToLoadTravelTimesFor) {
            service.travelTimes = travelTimesForServices.shift()
        }
    }

    return services;
}

export async function removeAllTransitTimes() {
    forEachServiceFromCache(service => {
        service.travelTimes = null
    })
}


export async function getService(
    serviceId: number
): Promise<Service> {
    const cachedService = getServiceFromCache(serviceId);

    console.log('greaed', cachedService)
    if (cachedService) {
        return cachedService;
    }

     console.log('111')

    const issClient = await getIssClient()
     console.log('222')

    const response: ServiceProps = await issClient.getService(serviceId)
    Object.assign(response, {
        now_open: {
            local_time: "2022-01-24T17:01:00+11:00",
            now_open: true,
            notes: ""
        }
    })
    console.log('ressss', response)
    const service = new Service(response);

    try {
        await attachTransportTimes([service]);
    } catch (error) {
        console.error("Unable to retrieve transport times")
        console.error(error);
    }

    return service;
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
        /* $FlowIgnore */
        if (keys.map(item => typeof orderBy.value[item] === "boolean")
            ?.some(val => val)) {

            // Creates two separate lists one that's matched and one
            // that's not then joins them together with matched list first
            for (let key = 0; key < keys.length; key++) {
                const matchedResults = results.filter(item =>
                    /* $FlowIgnore */
                    orderBy.key && item[orderBy.key][keys[key]]
                )
                const unMatchedResults = results.filter(item =>
                    orderBy.key &&
                    /* $FlowIgnore */
                    !item[orderBy.key][keys[key]]
                )
                newResults = matchedResults.concat(unMatchedResults)
            }
        } else {
            // Sort through the results
            newResults = results.sort(
                (serviceA: Object, serviceB: Object) => {
                    const nestedValue = (service: Object) => {
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
                /* $FlowIgnore */
                orderBy.key && item[orderBy.key]
            )
            const UnMatchedResults = results.filter(item =>
                /* $FlowIgnore */
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
