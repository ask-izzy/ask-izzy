/* @flow */
/**
 * ISS mock using Express */

import cors from "cors";
import express from "express";
import * as servicesProps from "../../../fixtures/servicesProps";
import {getServiceFixtureProps} from "../../../fixtures/factories/Service";
import type { serviceFixtureProps } from "../../../fixtures/factories/Service";

export function initMockISSServer() {
    const app = express();

    app.use(cors());

    app.use(express.json())

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

    let mocks = {};

    app.get("/", (req, res) => res.send("Sever started"));

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
                    getServiceFixtureProps(
                        servicesProps.housingServiceProps
                    ),
                    getServiceFixtureProps(
                        servicesProps.housingServiceSiblingProps
                    ),
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
                ].map(getServiceFixtureProps),
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
        } else if (req.query.q?.match(/food/) && !req.query.q?.match(/pet/)) {
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
                ].map(getServiceFixtureProps),
            });
        } else if (req.query.q?.match(/material aid/)) {
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
                    getServiceFixtureProps({...object, id: Seq()}),
                    getServiceFixtureProps({...object, id: Seq()}),
                    getServiceFixtureProps({...object, id: Seq()}),
                    getServiceFixtureProps({...object, id: Seq()}),
                    getServiceFixtureProps({...object, id: Seq()}),
                ],
            });
        } else if (req.query.q?.match(/zero results/)) {
            res.json({
                meta: {
                    total_count: 0,
                },
                objects: [],
            });
        } else if (req.query.q?.match(/cause error/)) {
            res
                .status(402)
                .json({
                    error_message: "You have specifically asked for an error.",
                });
        } else if (req.query.q?.match(/domestic violence/)) {
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
                    getServiceFixtureProps(
                        servicesProps.domesticViolenceServiceProps
                    ),
                ],
            });
        } else if (req.query.q?.match(/elasticsearch unavailable/)) {
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
                    getServiceFixtureProps(
                        servicesProps.housingServiceProps
                    ),
                    getServiceFixtureProps(
                        servicesProps.housingServiceSiblingProps
                    ),
                    getServiceFixtureProps(
                        servicesProps.youthSupportNetServiceProps
                    ),
                    getServiceFixtureProps(
                        servicesProps.susansHouseServiceProps
                    ),
                ],
            });
        }
    });

    app.post("/mock/search", (req, res) => {
        const {search, services} = req.body

        if (searchMocks[search]) {
            throw new Error(`Search ${search} is already mocked`);
        }

        // Prevent collisions with our awful legacy mocks.
        // Looking forward to removing this.
        if (legacyReservedSearches.some((regex) => search.match(regex))) {
            throw new Error(`Search ${search} matches a legacy reserved format`);
        }

        searchMocks[search] = services;
        res.send()
    })

    app.post("/mock/service", (req, res) => {
        const service = req.body
        if (mocks[service.id]) {
            throw new Error(`Service ID ${service.id} is already mocked`);
        }

        mocks[service.id] = service;
        app.get(`/api/v3/service/${service.id}`, (req, res) => {
            res.json(service);
        });
        res.send()
    })

    for (const servicePropsKey in servicesProps) {
        const serviceProps: serviceFixtureProps = servicesProps[servicePropsKey]
        app.get(`/api/v3/service/${serviceProps.id}/`, (req, res) => {
            res.json(getServiceFixtureProps(serviceProps));
        });
    }


    function logErrors(err, req, res, next) {
        console.error("err.stack", err, err && err.stack);
        next(err);
    }
    app.use(logErrors);

    const port = process.env.PORT
    if (!port) {
        throw Error("PORT env var must be set to start mock ISS")
    }

    app.listen(port);

    console.info(`Mock ISS server running at: http://localhost:${port}`)
}
