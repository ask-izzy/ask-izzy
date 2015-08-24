/*
 * Step definitions for BDD tests
 */

"use strict";

module.exports = (function() {

    // include libraries here
    return [
        require('./browser.js'),
        require('./branding.js'),
        require('./geolocation.js'),
        require('./results.js'),
    ];
})();
