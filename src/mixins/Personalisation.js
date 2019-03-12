/* @flow */

import React from "react";
import PropTypes from "proptypes";

class Personalisation<Props, State> extends React.Component<Props, State> {
    static contextTypes = {
        // Would be nice to specify type here,
        // but we can't have cyclic imports.
        // controller: PropTypes.instanceOf(BasePersonalisationPage),
        controller: PropTypes.object.isRequired,
    };

    nextStep(): void {
        this.context.controller.nextStep();
    }

    previousStep(): void {
        this.context.controller.previousStep();
    }
}

export default Personalisation;
