/* @flow */

import React from "react";
import PropTypes from "proptypes";
import {Category} from "../constants/categories";

type Props = {
    category: ?Category,
    name?: string
}

class Personalisation<ChildProps, ChildState> extends React.Component<ChildProps & Props, ChildState> {
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

    get bannerImage(): string {
        if (this.props.name === "sub-indigenous") {
            return "atsi"
        } else if (this.props.category && this.props.category.bannerImage) {
            return this.props.category.bannerImage
        } else {
            return "homepage"
        }
    }
}

export default Personalisation;
