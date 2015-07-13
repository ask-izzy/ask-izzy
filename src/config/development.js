/* @flow */

var express = require('express');

export default function(app: express): void {
    new require('./webpack')(app);
}
