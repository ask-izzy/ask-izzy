/*
 * Step definitions for BDD tests
 */

"use strict";

module.exports = (function() {

    // include libraries here
    return [
        require('./browser'),
        require('./branding'),
        require('./datetime'),
        require('./geolocation'),
        require('./maps'),
        require('./results'),
    ];
})();
