/**
 * List of service provisions, aka What we provide here
 *
 * These are phrases extracted from the description of a service to
 * show dot points for what a service provides */

/* @flow */

"use strict";

import {
    ServiceProvision,
    allOf,
    anyOf,
    keywords,
    not,
    provides,
} from '../ServiceProvisions';

/* Please keep this grouped */
var serviceProvisions: Array<ServiceProvision> = [
    /* General */
    provides({
        name: "Advice",
        form: allOf(
            'advice',
            not('legal'),
        ),
    }),

    /* Legal advice */
    provides({
        name: "Advice on legal matters",
        form: "legal advice",
    }),
    provides({
        name: "Civil law advice",
        form: keywords('civil', /law|matters/),
    }),
    provides({
        name: "Criminal law advice",
        form: keywords('criminal', /law|matters/),
    }),
    provides({
        name: "Family law advice",
        form: keywords('family', /law|matters/),
    }),

    /* Food */
    provides({
        name: "Breakfast",
        form: keywords('free', 'breakfast'),
    }),
    provides({
        name: "Lunch",
        form: keywords('free', 'lunch'),
    }),
    provides({
        name: "Dinner",
        form: keywords('free', /dinner|evening meal/),
    }),

    /* Accommodation */
    provides({
        name: "Family accommodation",
        form: keywords('accommodation', 'for', 'families'),
    }),
    provides({
        name: "Crisis accommodation",
        form: anyOf(
            keywords(/crisis|emergency/, /accommodation|housing|shelter/),
            keywords('housing', 'crisis'),
            keywords('refuge', 'accommodation'),  // N.B. not refugee
        ),
    }),

    /* Case management */
    provides({
        name: "Case management",
        form: allOf(
            'case-management',
            not(
                'long-term',
                'short-term',
                'medium-term',
            ),
        ),
    }),
    provides({
        name: "Short-term case management",
        form: keywords('short', 'term', 'case management'),
    }),
    provides({
        name: "Medium-term case management",
        form: keywords('medium', 'term', 'case management'),
    }),
    provides({
        name: "Long-term case management",
        form: keywords('long', 'term', 'case management'),
    }),

    /* Material aid */
    provides({
        name: "Clothing",
        form: 'clothing',
    }),

    /* Referrals */
    provides({
        name: "Drug & alcohol referrals",
        form: keywords(/referrals?/, 'for', /drugs?/, 'alcohol'),
    }),
    provides({
        name: "Referrals for financial counselling",
        form: anyOf(
            keywords(/referrals?/, 'for', 'financial', 'counselling'),
            keywords(/referrals?/, 'to', 'financial', 'counsellors'),
        ),
    }),

    // }, {
        // cname: "Food parcels",
        // forms: [
            // "food (?!vouchers)",
            // "food hampers",
            // "food parcels",
        // ],
    // }, {
        // ],
    // }, {
        // cname: "Housing information",
        // forms: [
            // /housing([^.]*) information/,
            // /information([^.]*) housing/,
        // ],
    // }, {
        // cname: "Housing referrals",
        // forms: [
            // /housing([^.]*) referrals?/,
            // /referrals?([^.]*) housing/,
        // ],
    // }, {
        // cname: "Legal assistance to help you pay for a lawyer",
        // forms: [
            // "legal aid",
            // "legal representation",
        // ],
    // }, {
        // cname: "Referrals for legal services",
        // forms: [
            // /referrals? for([^.]*) legal services/,
        // ],
    // }, {
        // cname: "Long-term accommodation",
        // forms: [
            // /long[ -]term(.* and [^.]+)? (housing|accommodation)/,
        // ],
    // }, {
        // cname: "Mental health referrals",
        // forms: [
            // /referrals? for([^.]*) mental health/,
        // ],
    // }, {
        // cname: "Public transport cards",
        // forms: [
            // "Met cards",
            // "Myki cards",
        // ],
    // }, {
        // cname: "Short-term accommodation",
        // forms: [
            // /short[ -]term(.* and [^.]+)? (housing|accommodation)/,
        // ],
    // }, {
        // cname: "Tenancy information",
        // forms: [
            // /tenancy([^.]*) information/,
            // /information([^.]*) tenancy/,
        // ],
    // }, {
        // cname: "Toiletries",
    // }, {
        // cname: "Transitional accommodation",
        // forms: [
            // /transitional(.* and [^.]+)? (housing|accommodation)/,
        // ],
    // },
];

export default serviceProvisions;
