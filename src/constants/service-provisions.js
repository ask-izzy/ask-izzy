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
        cname: "Civil law advice",
        forms: [
            /civil (law|matters)/,
        ],
    }, {
        cname: "Criminal law advice",
        forms: [
            /criminal (law|matters)/,
        ],
    }, {
        cname: "Crisis accommodation",
        forms: [
            /(crisis|emergency) (accommodation|housing|shelter)/,
            "housing crisis",
            "refuge accommodation",  // N.B. not refugee
        ],
    }, {
        cname: "Family law advice",
        forms: [
            /family (law|matters)/,
        ],
    }, {
        cname: "Legal assistance to help you pay for a lawyer",
        forms: [
            "legal aid",
            "legal representation",
        ],
    }, {
        cname: "Long-term accommodation",
        forms: [
            /long[ -]term (housing|accommodation)/,
        ],
    }, {
        cname: "Short-term accommodation",
        forms: [
            /short[ -]term (housing|accommodation)/,
        ],
    }, {
        cname: "Transitional accommodation",
        forms: [
            'transitional housing',
        ],
    },
];

export default serviceProvisions;
