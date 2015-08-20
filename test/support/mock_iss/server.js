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
    res.json({
        objects: [
            services.housingService,
            services.youthSupportNet,
            services.susansHouse,
        ],
    });
});

app.listen(5000);
