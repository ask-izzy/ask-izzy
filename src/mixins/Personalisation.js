/* @flow */

import * as React from "react";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category";
import {getCategory} from "../constants/categories";

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
            this.props.category?.key || "homepage";
    }

    /**
     * Used to get the current category based off the page
     * @returns {?Category} - returns the category
     */
    get category(): ?Category {
        return getCategory(
            this.context.router.match.params.page
        )
    }
}

export default Personalisation;
