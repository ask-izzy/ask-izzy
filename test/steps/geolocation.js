/*
 * Definitions for Geolocation related steps
 */

/* @flow */

"use strict";

import Yadda from 'yadda';

import unpromisify from "../support/yadda-promise";
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .given('my location is "$STRING"', unpromisify(setLocation));
})();

/**
 * setLocation:
 * Set the user's location in the browser's session
 */
async function setLocation(location: string): Promise {
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(`
    sessionStorage.setItem("location", "${location}");
    `);
}
