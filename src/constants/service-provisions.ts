/**
 * List of service provisions, aka What we provide here
 *
 * These are phrases extracted from the description of a service to
 * show dot points for what a service provides */

import {
    ServiceProvision,
    allOf,
    anyOf,
    keywords,
    not,
    provides,
    referralsRegexp,
} from "@/src/iss/ServiceProvisions.js";


/* Please keep this grouped and the groups sorted */
const serviceProvisions: Array<ServiceProvision> = [
    /* Accommodation */
    provides({
        name: "Crisis accommodation for women fleeing domestic violence",
        form: keywords(/crisis|emergency|refuge/, "accommodation",
            "women", /family|domestic/, "violence"),
    }),
    provides({
        name: "Family accommodation",
        form: keywords("accommodation", "for", "families"),
    }),
    provides({
        name: "Crisis accommodation",
        form: anyOf(
            keywords(
                /Provid(es|ing)? ((short|long)-term )?(crisis|emergency)/i,
                /accommodation|housing|shelter/,
            ),
            keywords("housing", "crisis"),
            keywords("refuge", "accommodation"), // N.B. not refugee
        ),
    }),
    provides({
        name: "Short-term accommodation",
        form: keywords("short-term", /housing|accommodation/),
    }),
    provides({
        name: "Long-term accommodation",
        form: keywords("long-term", /housing|accommodation/),
    }),
    provides({
        name: "Transitional accommodation",
        form: keywords("transitional", /housing|accommodation/),
    }),
    provides({
        name: "Public housing",
        form: keywords("public", /housing|accommodation/),
    }),
    provides({
        name: "Community housing",
        form: allOf(
            keywords(/community|social/, "housing"),
            not(/community|social/, "housing tenants"),
        ),
    }),

    /* Case management */
    provides({
        name: "Case management",
        form: allOf(
            "case-management",
            not(
                "long-term",
                "short-term",
                "medium-term",
            ),
        ),
    }),
    provides({
        name: "Short-term case management",
        form: keywords("short", "term", "case management"),
    }),
    provides({
        name: "Medium-term case management",
        form: keywords("medium", "term", "case management"),
    }),
    provides({
        name: "Long-term case management",
        form: keywords("long", "term", "case management"),
    }),

    /* Food */
    provides({
        name: "Breakfast",
        form: keywords("breakfast"),
    }),
    provides({
        name: "Lunch",
        form: keywords("lunch"),
    }),
    provides({
        name: "Dinner",
        form: keywords(/dinner|evening meal/),
    }),
    provides({
        name: "Meals",
        form: keywords(/(hot|cold)?/, /nutritious?/, /meals?/),
    }),

    /* General */
    provides({
        name: "Advice",
        form: allOf(
            "advice",
            not("legal"),
            not("tenancy"),
        ),
    }),
    provides({
        name: "Support services",
        form: "support services",
    }),

    /* Information */
    provides({
        name: "Housing information",
        form: anyOf(
            keywords("housing", "information"),
            keywords("information", "housing"),
        ),
    }),
    provides({
        name: "Tenancy information",
        form: anyOf(
            keywords("tenancy", "information"),
            keywords("information", "tenancy"),
        ),
    }),

    /* Legal advice */
    provides({
        name: "Advice on legal matters",
        form: "legal advice",
    }),
    provides({
        name: "Tenancy advice",
        form: "tenancy advice",
    }),
    provides({
        name: "Civil law advice",
        form: keywords("civil", /law|matters/),
    }),
    provides({
        name: "Criminal law advice",
        form: keywords("criminal", /law|matters/),
    }),
    provides({
        name: "Family law advice",
        form: keywords("family", /law|matters/),
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
        form: "clothing",
    }),
    provides({
        name: "Blankets",
        form: "blankets",
    }),
    provides({
        name: "Showers",
        form: "showers",
    }),
    provides({
        name: "Laundry",
        form: "laundry",
    }),
    provides({
        name: "Food parcels",
        form: keywords("food", /hampers|parcels/),
    }),
    provides({
        name: "Food vouchers",
        form: keywords("food vouchers"),
    }),
    provides({
        name: "Public transport cards",
        form: keywords(/met|myki|public transport/, "cards"),
    }),
    provides({
        name: "Toiletries",
        form: "toiletries",
    }),

    /* Referrals */
    provides({
        name: "Drug & alcohol referrals",
        form: keywords(referralsRegexp, "for", /drugs?/, "alcohol"),
    }),
    provides({
        name: "Referrals for financial counselling",
        form: keywords(referralsRegexp, /for|to/, "financial", /counsell\w+/),
    }),
    provides({
        name: "Referrals for legal services",
        form: keywords(referralsRegexp, "for", "legal services"),
    }),
    provides({
        name: "Housing referrals",
        form: anyOf(
            keywords("housing", referralsRegexp),
            keywords(referralsRegexp, "for", "housing"),
        ),
    }),
    provides({
        name: "Mental health referrals",
        form: keywords(referralsRegexp, "for", "mental health"),
    }),
];

export default serviceProvisions;
