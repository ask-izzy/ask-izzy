/* @flow */

import React from "react";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category";

type Props = {
    nextStep: Function,
    previousStep: Function,
    category?: Category,
    name?: string,
}

class Personalisation<
    ChildProps, ChildState
> extends React.Component<
    ChildProps & Props, ChildState
> {
    static contextType = routerContext;

    nextStep = () => this.props.nextStep()

    previousStep = () => this.props.previousStep()

    get bannerName(): string {
        return (this.props.name === "sub-indigenous" && "atsi") ||
            this.props.category?.bannerImage || "homepage";
    }
}

export default Personalisation;
