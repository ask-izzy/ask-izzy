/* @flow */

"use strict";

import React from 'react';

import BasePersonalisationPage from '../pages/BasePersonalisationPage';

var Personalisation = {
    contextTypes: {
        controller: React.PropTypes.instanceOf(BasePersonalisationPage),
    },

    nextStep: function nextStep(): void {
        this.context.controller.nextStep();
    },

    previousStep: function previousStep(): void {
        this.context.controller.previousStep();
    },
};

export default Personalisation;
