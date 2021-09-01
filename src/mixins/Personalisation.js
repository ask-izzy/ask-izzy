/* @flow */

import * as React from "react";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category";

type Props = {
    nextStep: Function,
    previousStep: Function,
    backToAnswers: boolean,
    category?: Category,
    name?: string,
}

class Personalisation<
    ChildProps, ChildState
> extends React.Component<
    ChildProps & Props, ChildState
> {
    static contextType: any = routerContext;

    nextStep: (() => any) = () => this.props.nextStep()

    previousStep: (() => any) = () => this.props.previousStep()

    backToAnswers(): boolean {
        return this.props.backToAnswers || false
    }

    get bannerName(): string {
        return (this.props.name === "sub-indigenous" && "atsi") ||
            this.props.category?.bannerImage || "homepage";
    }
}

export default Personalisation;
