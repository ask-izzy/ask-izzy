/* @flow */
/**
 * ISS mock using Express */

import cors from "cors";
import express from "express";
import services from "../../../fixtures/services";
import ServiceFactory from "../../../fixtures/factories/Service";
var app = express();

app.use(cors());

/* eslint-disable complexity */
/* FIXME: refactor */
app.get("/api/v3/search/", (req, res) => {

    if (req.query.site_id == "111") {
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
    } else if (req.query.site_id == "444") {
        res.json({
            meta: {
                total_count: 6,
            },
            objects: [
                {
                    id: 444,  // ourselves
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
            ],
        });
    } else if (req.query.site_id) {
        /* other related services search */
        res.json({
            meta: {},
            objects: [],  // FIXME: should return ourselves
        });
    } else if (req.query.area == "carlt") {
        res
            .status(402)
            .json({
                error_message: 'Could not find a location matching "carlt"',
            });
    } else if (req.query.q.match(/food/) && !req.query.q.match(/pet/)) {
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
                {
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
                    id: 445,
                    name: "Community Urgent",
                    site: {
                        id: 445,
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
                        number: "0312345601",
                        kind: "fax",
                    },

                    {
                        comment: "",
                        number: "0311111111",
                        kind: "mobile",
                    },
                    ],
                },
                {
                    id: 446,
                    name: "Instant Service",
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
                        number: "0322221122",
                        kind: "",
                    },
                    {
                        comment: "",
                        number: "0345671234",
                        kind: "phone",
                    },
                    {
                        comment: "",
                        number: "0345671259",
                        kind: "freecall",
                    },
                    ],
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
                    },
                    ],
                },
            ],
        });
    } else if (req.query.q.match(/material aid/)) {
        var object = {
            id: 444,
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
                next: req.originalUrl,
            },
            objects: [
                object,
                object,
                object,
                object,
                object,
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
                ServiceFactory(services.youthSupportNet),
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

app.listen(5000);

var mocks = {};

export function mock(service: Object): void {
    if (mocks[service.id]) {
        throw new Error(`Service ID ${service.id} is already mocked`);
    }

    mocks[service.id] = service;
    app.get(`/api/v3/service/${service.id}`, (req, res) => {
        res.json(service);
    });
}

export default {
    mock: mock,
}
