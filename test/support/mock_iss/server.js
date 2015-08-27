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
    } else if (req.query.site_id) {
        /* other related services search */
        res.json({
            meta: {},
            objects: [],  // FIXME: should return ourselves
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

app.listen(5000);
