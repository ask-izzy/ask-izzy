/* @flow */

import React from "react";

import BasePersonalisationPage from "../pages/BasePersonalisationPage";

var Personalisation = {
    contextTypes: {
        controller: React.PropTypes.instanceOf(BasePersonalisationPage),
    },

    propTypes: {
        name: React.PropTypes.string.isRequired,
    },

    nextStep: function nextStep(): void {
        this.context.controller.nextStep();
    },

    previousStep: function previousStep(): void {
        this.context.controller.previousStep();
    },
};

export default Personalisation;
