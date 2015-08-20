/* @flow */
/**
 * ISS mock using Express */

"use strict";

import cors from 'cors';
import express from 'express';

var app = express();

app.use(cors());

app.get('/api/v3/search/', (req, res) => {
    res.json({
        objects: [
            {
                id: 111,
                name: "Housing Service",
                site: {
                    name: "My Housing Service",
                },
                service_types: ['Housing Service'],
                now_open: {
                    now_open: false,
                },
                opening_hours: [],
            }, {
                id: 222,
                name: "Emergency Accom",
                site: {
                    name: "My Housing Service",
                },
                service_types: ['Accommodation'],
                now_open: {
                    now_open: true,
                },
                opening_hours: [],
            }, {
                id: 333,
                name: "Womens Refuge",
                site: {
                    name: "My Housing Service",
                },
                service_types: ['Refuge'],
                now_open: {
                    now_open: true,
                },
                opening_hours: [],
            },
        ],
    });
});

app.listen(5000);
