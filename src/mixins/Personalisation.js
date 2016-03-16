/* @flow */

import React from "react";

const Personalisation = {
    contextTypes: {
        // Would be nice to specify type here,
        // but we can't have cyclic imports.
        // controller: React.PropTypes.instanceOf(BasePersonalisationPage),
        controller: React.PropTypes.object.isRequired,
    },

    nextStep: function nextStep(): void {
        this.context.controller.nextStep();
    },

    previousStep: function previousStep(): void {
        this.context.controller.previousStep();
    },
};

export default Personalisation;
