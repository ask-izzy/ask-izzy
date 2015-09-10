/* @flow */
/**
 * ISS mock using Express */

"use strict";

import cors from 'cors';
import express from 'express';
import services from '../../../fixtures/services';
var app = express();

app.use(cors());

app.get('/api/v3/search/', (req, res) => {

    if (req.query.site_id == '111') {
        /* related services search for housingService */
        res.json({
            meta: {
                total_count: 2,
            },
            objects: [
                services.housingService,
                services.housingServiceSibling,
            ],
        });
    } else if (req.query.site_id == '444') {
        res.json({
            meta: {
                total_count: 6,
            },
            objects: [
                {
                    id: 444,  // ourselves
                    name: 'Community Lunch',
                }, {
                    id: 445,
                    name: 'Material Aid',
                }, {
                    id: 446,
                    name: 'Community Outreach',
                }, {
                    id: 447,
                    name: 'Crisis Accommodation',
                }, {
                    id: 448,
                    name: 'Centrelink Services',
                }, {
                    id: 449,
                    name: 'Drug & Alcohol Counselling',
                },
            ],
        });
    } else if (req.query.site_id) {
        /* other related services search */
        res.json({
            meta: {},
            objects: [],  // FIXME: should return ourselves
        });
    } else if (req.query.q == 'food') {
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
                            day: 'Wednesday',
                            open: '9:00:00',
                            close: '17:00:00',
                        },
                    ],
                    location: {
                        suburb: 'Richmond',
                    },
                },
            ],
        });
    } else if (req.query.q == 'material aid') {
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
                    day: 'Wednesday',
                    open: '9:00:00',
                    close: '17:00:00',
                },
            ],
            location: {
                suburb: 'Richmond',
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
    } else if (req.query.q == 'zero results') {
        res.json({
            meta: {
                total_count: 0,
            },
            objects: [],
        });
    } else if (req.query.q == 'cause error') {
        res
            .status(402)
            .json({
                error_message: "You have specifically asked for an error.",
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
                services.housingService,
                services.youthSupportNet,
                services.susansHouse,
            ],
        });
    }
});

app.get('/api/v3/service/111/', (req, res) => {
    res.json(services.housingService);
});

app.get('/api/v3/service/13841/', (req, res) => {
    res.json(services.legal);
});

app.get('/api/v3/service/866464/', (req, res) => {
    res.json(services.ixa);
});

app.get('/api/v3/service/5551234/', (req, res) => {
    res.json(services.phoneableService);
});

app.listen(5000);
