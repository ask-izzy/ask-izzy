/* @flow */

import PropTypes from "proptypes";

const Personalisation = {
    contextTypes: {
        // Would be nice to specify type here,
        // but we can't have cyclic imports.
        // controller: PropTypes.instanceOf(BasePersonalisationPage),
        controller: PropTypes.object.isRequired,
    },

    nextStep: function nextStep(): void {
        this.context.controller.nextStep();
    },

    previousStep: function previousStep(): void {
        this.context.controller.previousStep();
    },
};

export default Personalisation;
