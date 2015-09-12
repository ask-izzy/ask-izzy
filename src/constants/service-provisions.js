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

/* Please keep this grouped and the groups sorted */
var serviceProvisions: Array<ServiceProvision> = [
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
    provides({
        name: "Short-term accommodation",
        form: keywords('short-term', /housing|accommodation/),
    }),
    provides({
        name: "Long-term accommodation",
        form: keywords('long-term', /housing|accommodation/),
    }),
    provides({
        name: "Transitional accommodation",
        form: keywords('transitional', /housing|accommodation/),
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

    /* General */
    provides({
        name: "Advice",
        form: allOf(
            'advice',
            not('legal'),
        ),
    }),
    provides({
        name: "Support services",
        form: 'support services',
    }),

    /* Information */
    provides({
        name: "Housing information",
        form: anyOf(
            keywords('housing', 'information'),
            keywords('information', 'housing'),
        ),
    }),
    provides({
        name: "Tenancy information",
        form: anyOf(
            keywords('tenancy', 'information'),
            keywords('information', 'tenancy'),
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

    /* Legal aid */
    provides({
        name: "Legal assistance to help you pay for a lawyer",
        form: anyOf(
            "legal aid",
            "legal representation",
        ),
    }),

    /* Material aid */
    provides({
        name: "Clothing",
        form: 'clothing',
    }),
    provides({
        name: "Food parcels",
        form: keywords('food', /hampers|parcels/),
    }),
    provides({
        name: "Public transport cards",
        form: keywords(/met|myki|public transport/, 'cards'),
    }),
    provides({
        name: "Toiletries",
        form: 'toiletries',
    }),

    /* Referrals */
    provides({
        name: "Drug & alcohol referrals",
        form: keywords(/referrals?/, 'for', /drugs?/, 'alcohol'),
    }),
    provides({
        name: "Referrals for financial counselling",
        form: keywords(/referrals?/, /for|to/, 'financial', /counsell\w+/),
    }),
    provides({
        name: "Referrals for legal services",
        form: keywords(/referrals?/, 'for', 'legal services'),
    }),
    provides({
        name: "Housing referrals",
        form: anyOf(
            keywords('housing', /referrals?/),
            keywords(/referrals?/, 'for', 'housing'),
        ),
    }),
    provides({
        name: "Mental health referrals",
        form: keywords(/referrals?/, 'for', 'mental health'),
    }),
];

export default serviceProvisions;
