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
                    suburb: "Richmond",
                    state: "VIC",
                },
            },
            objects: [
                {
                    id: 444,
                    name: "Community Lunch",
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
    } else {
        /* conventional search */
        res.json({
            meta: {
                total_count: 3,
                location: {
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
    res.json({
        id: 13841,
        name: "Legal Service",
        description: "A service. Provides free legal advice to people.",
        site: {
            name: "Service.com",
            id: 999,
        },
        catchment: "Carlton",
        eligibility_info: "",
        ineligibility_info: "",
        service_types: ['Legal'],
        now_open: {
            now_open: false,
        },
        opening_hours: [],
        phones: [],
        location: {
            suburb: 'Carlton',
        },
    });
});

app.listen(5000);
