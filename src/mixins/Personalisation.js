/* @flow */

"use strict";

import React from 'react';

import PersonalisationPage from '../pages/PersonalisationPage';

var Personalisation = {
    contextTypes: {
        controller: React.PropTypes.instanceOf(PersonalisationPage),
    },

    nextStep: function nextStep(): void {
        this.context.controller.nextStep();
    },

    previousStep: function previousStep(): void {
        this.context.controller.previousStep();
    },
};

export default Personalisation;
