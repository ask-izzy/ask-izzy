/* @flow */

import * as React from "react";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category";

type Props = {
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

    // backToAnswers(): boolean {
    //     return this.props.backToAnswers || false
    // }

    get bannerName(): string {
        return (this.props.name === "sub-indigenous" && "atsi") ||
            this.props.category?.key || "homepage";
    }
}

export default Personalisation;
