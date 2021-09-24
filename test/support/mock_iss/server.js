/* @flow */
/**
 * ISS mock using Express */

import cors from "cors";
import express from "express";
import services from "../../../fixtures/services";
import ServiceFactory from "../../../fixtures/factories/Service";
const app = express();

app.use(cors());

let seq = 1000050;

function Seq(): number {
    return seq++;
}

const legacyReservedSearches = [
    /food/,
    /pet/,
    /material aid/,
    /zero results/,
    /cause error/,
    /domestic violence/,
    /elasticsearch unavailable/,
]
let searchMocks = {};

export function mockSearch(search: string, services: Array<Object>): void {
    if (searchMocks[search]) {
        throw new Error(`Search ${search} is already mocked`);
    }

    // Prevent collisions with our awful legacy mocks.
    // Looking forward to removing this.
    if (legacyReservedSearches.some((regex) => search.match(regex))) {
        throw new Error(`Search ${search} matches a legacy reserved format`);
    }

    searchMocks[search] = services;
}

let mocks = {};

export function mock(service: Object): void {
    if (mocks[service.id]) {
        throw new Error(`Service ID ${service.id} is already mocked`);
    }

    mocks[service.id] = service;
    app.get(`/api/v3/service/${service.id}`, (req, res) => {
        res.json(service);
    });
}

app.get("/api/v3/location/search/", (req, res) => {
    res.json({
        meta: {},
        objects: [
            {name: "Carlton", state: "VIC"},
            {name: "Carlton North", state: "VIC"},
        ],
    });
});

app.get("/api/v3/list-all-mocked/", (req, res) => {
    res.json(mocks);
});

/* eslint-disable complexity */
/* FIXME: refactor to use mocks instead of these */
app.get("/api/v3/search/", (req, res) => {
    let mockId = parseInt(req.query.q);

    if (mocks[mockId]) {
        res.json({
            meta: {
                total_count: 1,
                location: {
                    name: "Richmond",
                    suburb: "Richmond",
                    state: "VIC",
                },
            },
            objects: [mocks[mockId]],
        });
    } else if (req.query.site_id === "111") {
        /* related services search for housingService */
        res.json({
            meta: {
                total_count: 2,
            },
            objects: [
                ServiceFactory(services.housingService),
                ServiceFactory(services.housingServiceSibling),
            ],
        });
    } else if (req.query.site_id === "444") {
        res.json({
            meta: {
                total_count: 6,
            },
            objects: [
                {
                    id: 444, // ourselves
                    name: "Community Lunch",
                }, {
                    id: 445,
                    name: "Material Aid",
                }, {
                    id: 446,
                    name: "Community Outreach",
                }, {
                    id: 447,
                    name: "Crisis Accommodation",
                }, {
                    id: 448,
                    name: "Centrelink Services",
                }, {
                    id: 449,
                    name: "Drug & Alcohol Counselling",
                },
            ].map(ServiceFactory),
        });
    } else if (req.query.site_id) {
        /* other related services search */
        res.json({
            meta: {},
            objects: [],
        });
    } else if (req.query.area === "carlt") {
        res
            .status(402)
            .json({
                error_message: "Could not find a location matching \"carlt\"",
            });
    } else if (searchMocks[req.query.q]) {
        res.json({
            meta: {
                total_count: searchMocks[req.query.q].length,
                location: {
                    name: "Richmond",
                    suburb: "Richmond",
                    state: "VIC",
                },
            },
            objects: searchMocks[req.query.q],
        });
    } else if (req.query.q.match(/food/) && !req.query.q.match(/pet/)) {
        res.json({
            meta: {
                total_count: 4,
                location: {
                    name: "Richmond",
                    suburb: "Richmond",
                    state: "VIC",
                },
            },
            objects: [
                {
                    crisis: true,
                    name: "Community Urgent",
                    site: {name: "Youth Support Net"},
                    phones: [{
                        number: "0311111111",
                        kind: "mobile",
                    }],
                }, {
                    name: "Instant Service",
                    site: {name: "Youth Support Net"},
                    crisis: true,
                    phones: [
                        {
                            number: "0322221122",
                            kind: "",
                        },
                        {
                            number: "0345671234",
                            kind: "phone",
                        },
                        {
                            number: "0345671259",
                            kind: "freecall",
                        },
                    ],
                }, {
                    id: 444,
                    name: "Community Lunch",
                    description:
                        "A weekly free lunch for those in need. " +
                        "Referrals for mental health and housing are also " +
                        "available as is advice and a range of support " +
                        "services.",
                    site: {
                        id: 444,
                        name: "Youth Support Net",
                    },
                    now_open: {
                        now_open: false,
                    },
                    opening_hours: [
                        {
                            day: "Wednesday",
                            open: "9:00:00",
                            close: "17:00:00",
                        },
                    ],
                    location: {
                        suburb: "Richmond",
                    },
                },
                {
                    id: 446,
                    name: "Instant Mobile",
                    site: {
                        id: 446,
                        name: "Youth Support Net",
                    },
                    now_open: {
                        now_open: false,
                    },
                    opening_hours: [],
                    location: {
                        suburb: "Richmond",
                    },
                    crisis: true,
                    phones: [{
                        comment: "",
                        number: "0345671234",
                        kind: "phone",
                    }],
                },
            ].map(ServiceFactory),
        });
    } else if (req.query.q.match(/material aid/)) {
        const object = {
            name: "Community Lunch",
            description: "A weekly lunch.",
            site: {
                id: 444,
                name: "Youth Support Net",
            },
            now_open: {
                now_open: false,
            },
            opening_hours: [
                {
                    day: "Wednesday",
                    open: "9:00:00",
                    close: "17:00:00",
                },
            ],
            location: {
                suburb: "Richmond",
                point: {
                    lat: -37.8228,
                    lon: 144.998,
                },
            },
        };

        res.json({
            meta: {
                total_count: 8,
                location: {
                    name: "Richmond",
                    suburb: "Richmond",
                    state: "VIC",
                },
                next: req.originalUrl + "&offset=5",
            },
            objects: [
                ServiceFactory({...object, id: Seq()}),
                ServiceFactory({...object, id: Seq()}),
                ServiceFactory({...object, id: Seq()}),
                ServiceFactory({...object, id: Seq()}),
                ServiceFactory({...object, id: Seq()}),
            ],
        });
    } else if (req.query.q.match(/zero results/)) {
        res.json({
            meta: {
                total_count: 0,
            },
            objects: [],
        });
    } else if (req.query.q.match(/cause error/)) {
        res
            .status(402)
            .json({
                error_message: "You have specifically asked for an error.",
            });
    } else if (req.query.q.match(/domestic violence/)) {
        res.json({
            meta: {
                total_count: 1,
                location: {
                    name: "Richmond",
                    suburb: "Richmond",
                    state: "VIC",
                },
            },
            objects: [
                ServiceFactory(services.domesticviolence),
            ],
        });
    } else if (req.query.q.match(/elasticsearch unavailable/)) {
        res
            .status(503)
            .json({
                error_message: "The Elasticsearch service is unavailable.",
            });
    } else {
        /* conventional search */
        res.json({
            meta: {
                total_count: 3,
                location: {
                    name: "Richmond",
                    suburb: "Richmond",
                    state: "VIC",
                },
            },
            objects: [
                ServiceFactory(services.housingService),
                ServiceFactory(services.housingServiceSibling),
                ServiceFactory(services.youthSupportNet),
                ServiceFactory(services.openService),
                ServiceFactory(services.susansHouse),
            ],
        });
    }
});

app.get("/api/v3/service/111/", (req, res) => {
    res.json(ServiceFactory(services.housingService));
});

app.get("/api/v3/service/13841/", (req, res) => {
    res.json(ServiceFactory(services.legal));
});

app.get("/api/v3/service/866464/", (req, res) => {
    res.json(ServiceFactory(services.ixa));
});

app.get("/api/v3/service/537512/", (req, res) => {
    res.json(services.domesticviolence);
});

app.get("/api/v3/service/13844/", (req, res) => {
    res.json(ServiceFactory(services.unhelpful));
});

app.get("/api/v3/service/5551234/", (req, res) => {
    res.json(ServiceFactory(services.phoneableService));
});

function logErrors(err, req, res, next) {
    console.error("err.stack", err, err && err.stack);
    next(err);
}

app.use(logErrors);

app.listen(parseInt(
    process.env.ISS_MOCK_PORT || ""
) || 5000);

export default {
    mock: mock,
    mockSearch: mockSearch,
}
