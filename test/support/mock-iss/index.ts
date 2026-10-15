/**
 * ISS (and locations API) mock using Express */

import cors from "cors";
import express from "express";
import * as servicesProps from "../../../fixtures/servicesProps";
import {getServiceFixtureProps} from "../../../fixtures/factories/Service";
import type { serviceFixtureProps } from "../../../fixtures/factories/Service";

function searchResults(
    results: Array<unknown>,
    {count = results.length, next = null}: {count?: number, next?: string | null} = {}
) {
    return {
        count,
        count_available: count,
        next,
        prev: null,
        results,
    }
}

function createFakeJwt(): string {
    const encode = (obj: object) =>
        Buffer.from(JSON.stringify(obj)).toString("base64url")
    const oneDayInSeconds = 60 * 60 * 24
    return [
        encode({alg: "HS256", typ: "JWT"}),
        encode({exp: Math.round(Date.now() / 1000) + oneDayInSeconds}),
        "fake-signature",
    ].join(".")
}

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

    /* Locations API */

    app.post("/api/token/", (req, res) => {
        res.json({
            access: createFakeJwt(),
            refresh: createFakeJwt(),
        });
    });

    app.post("/api/token/refresh/", (req, res) => {
        res.json({
            access: createFakeJwt(),
        });
    });

    app.get("/api/search/all/suggest/", (req, res) => {
        res.json(searchResults([
            {
                id: 1,
                name: "Carlton",
                location_type: "suburb",
                suburb: "Carlton",
                state: "VIC",
                postcode: "3053",
            },
            {
                id: 2,
                name: "Carlton North",
                location_type: "suburb",
                suburb: "Carlton North",
                state: "VIC",
                postcode: "3054",
            },
        ]));
    });

    /* ISS */

    app.get("/api/directory/list-all-mocked/", (req, res) => {
        res.json(mocks);
    });

    /* eslint-disable complexity */
    /* FIXME: refactor to use mocks instead of these */
    app.get("/api/directory/search/", (req, res) => {
        const searchTerms = req.query["search-terms"] as string | undefined
        const site = req.query.site as string | undefined
        let mockId = parseInt(searchTerms as string);

        if (mocks[mockId]) {
            res.json(searchResults([mocks[mockId]]));
        } else if (site === "111") {
            /* related services search for housingService */
            res.json(searchResults([
                getServiceFixtureProps(
                    servicesProps.housingServiceProps
                ),
                getServiceFixtureProps(
                    servicesProps.housingServiceSiblingProps
                ),
            ]));
        } else if (site === "444") {
            res.json(searchResults(
                [
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
                ].map(getServiceFixtureProps as (props: unknown) => ReturnType<typeof getServiceFixtureProps>)
            ));
        } else if (site) {
            /* other related services search */
            res.json(searchResults([]));
        } else if (req.query["located-near"] === "carlt") {
            res
                .status(400)
                .json({
                    "located-near": "Could not find a location matching \"carlt\"",
                });
        } else if (searchMocks[searchTerms as string]) {
            res.json(searchResults(searchMocks[searchTerms as string]));
        } else if (searchTerms?.match(/food/) && !searchTerms?.match(/pet/)) {
            res.json(searchResults(
                [
                    {
                        is_crisis: true,
                        name: "Community Urgent",
                        site: {name: "Youth Support Net"},
                        phones: [{
                            number: "0311111111",
                            phone_type: "mobile",
                        }],
                    }, {
                        name: "Instant Service",
                        site: {name: "Youth Support Net"},
                        is_crisis: true,
                        phones: [
                            {
                                number: "0322221122",
                                phone_type: "",
                            },
                            {
                                number: "0345671234",
                                phone_type: "phone",
                            },
                            {
                                number: "0345671259",
                                phone_type: "freecall",
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
                            location: {
                                suburb: "Richmond",
                            },
                        },
                        open_now: false,
                        opening_hours: [
                            {
                                day: "Wednesday",
                                open: "9:00:00",
                                close: "17:00:00",
                            },
                        ],
                    },
                    {
                        id: 446,
                        name: "Instant Mobile",
                        site: {
                            id: 446,
                            name: "Youth Support Net",
                            location: {
                                suburb: "Richmond",
                            },
                        },
                        open_now: false,
                        opening_hours: [],
                        is_crisis: true,
                        phones: [{
                            comment: "",
                            number: "0345671234",
                            phone_type: "phone",
                        }],
                    },
                ].map(getServiceFixtureProps as (props: unknown) => ReturnType<typeof getServiceFixtureProps>)
            ));
        } else if (searchTerms?.match(/material aid/)) {
            const object = {
                name: "Community Lunch",
                description: "A weekly lunch.",
                site: {
                    id: 444,
                    name: "Youth Support Net",
                    location: {
                        suburb: "Richmond",
                        geo_point: {
                            lat: -37.8228,
                            lon: 144.998,
                        },
                    },
                },
                open_now: false,
                opening_hours: [
                    {
                        day: "Wednesday",
                        open: "9:00:00",
                        close: "17:00:00",
                    },
                ],
            };

            res.json(searchResults(
                [
                    getServiceFixtureProps({...object, id: Seq()} as serviceFixtureProps),
                    getServiceFixtureProps({...object, id: Seq()} as serviceFixtureProps),
                    getServiceFixtureProps({...object, id: Seq()} as serviceFixtureProps),
                    getServiceFixtureProps({...object, id: Seq()} as serviceFixtureProps),
                    getServiceFixtureProps({...object, id: Seq()} as serviceFixtureProps),
                ],
                {
                    count: 8,
                    next: req.originalUrl + "&offset=5",
                }
            ));
        } else if (searchTerms?.match(/zero results/)) {
            res.json(searchResults([]));
        } else if (searchTerms?.match(/cause error/)) {
            res
                .status(400)
                .json({
                    detail: "You have specifically asked for an error.",
                });
        } else if (searchTerms?.match(/domestic violence/)) {
            res.json(searchResults([
                getServiceFixtureProps(
                    servicesProps.domesticViolenceServiceProps
                ),
            ]));
        } else if (searchTerms?.match(/elasticsearch unavailable/)) {
            res
                .status(503)
                .json({
                    detail: "The Elasticsearch service is unavailable.",
                });
        } else {
            /* conventional search */
            res.json(searchResults(
                [
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
                ]
            ));
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
        res.send()
    })

    const fixtureServices = {}
    for (const servicePropsKey in servicesProps) {
        const serviceProps: serviceFixtureProps = servicesProps[servicePropsKey]
        fixtureServices[serviceProps.id] = serviceProps
    }

    app.get("/api/directory/services/:id/", (req, res) => {
        const id = req.params.id
        if (mocks[id]) {
            res.json(mocks[id]);
        } else if (fixtureServices[id]) {
            res.json(getServiceFixtureProps(fixtureServices[id]));
        } else {
            res.status(404).json({detail: "No Service matches the given query."});
        }
    });


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
