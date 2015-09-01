/**
 * List of service provisions, aka What we provide here
 *
 * These are phrases extracted from the description of a service to
 * show dot points for what a service provides */

/* @flow */

"use strict";

type ServiceProvision = {
    /* canonical name for the service provision
     * (this is the one we display) */
    cname: string;
    /* a description of what this service provision is */
    description?: string;
    /* other forms for this service provision
     * (implicitly includes the cname) */
    forms?: Array<RegExp|string>
};

/* Please keep this sorted */
var serviceProvisions: Array<ServiceProvision> = [
    {
        cname: "Advice on legal matters",
        forms: [
            "legal advice",
        ],
    }, {
        cname: "Legal assistance to help you pay for a lawyer",
        forms: [
            "legal aid",
            "legal representation",
        ],
    },
];

export default serviceProvisions;
