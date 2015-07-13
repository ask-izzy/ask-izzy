/* @flow */

import React from 'react'
import { Router, Route, Link, Navigation } from 'react-router/lib/umd/ReactRouter';
var express = require('express');

var Index = require("../index");

export default function configureApp(app: express): void {
    app.use(function handleRequest(req, res, next) {
        if (! req.path.match(new RegExp("^/$"))) {
            next()
            return
        }

        var html = React.renderToString(<Index path={req.path} />)
        res.set('Content-Type', 'text/html');
        res.send(html);
    })
}

var categories = {
    housing:      "/categories/housing",
    food:         "/categories/food",
    materialAid:  "/categories/material-aid",
    finance:      "/categories/finance",
    legal:        "/categories/legal",
    councelling:  "/categories/councelling",
    health:       "/categories/health",
    lifeSkills:   "/categories/life-skills",
    activities:   "/categories/activities",
    technology:   "/categories/technology",
    centrelink:   "/categories/centrelink",
    jobServices:  "/categories/job-services"
}
