/* @flow */

import React from "react";

const Personalisation = {
    contextTypes: {
        // Would be nice to specify type here,
        // but we can't have cyclic imports.
        // controller: React.PropTypes.instanceOf(BasePersonalisationPage),
        controller: React.PropTypes.object.isRequired,
    },

    propTypes: {
        name: React.PropTypes.string.isRequired,
    },

    setNextEnabled: function setNextEnabled(enabled: boolean): void {
        this.context.controller.setState({nextDisabled: !enabled});
    },

    getNextEnabled: function getNextEnabled(): boolean {
        return !this.context.controller.state.nextDisabled;
    },

    nextStep: function nextStep(): void {
        this.context.controller.nextStep();
    },

    previousStep: function previousStep(): void {
        this.context.controller.previousStep();
    },
};

export default Personalisation;
