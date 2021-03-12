/* @flow */

import * as React from "react";
import PropTypes from "proptypes";
import components from "../components";
import _s from "underscore.string";
import routerContext from "../contexts/router-context";

type Props = {
    params: Object
}

export default class StyleGuideItem extends React.Component<Props, void> {
    static propTypes = {
        params: PropTypes.object,
    };

    static contextType = routerContext;

    constructor(props: Object) {
        super(props);
    }

    getComponentName(): string {
        return this.context.router.match.params.componentName;
    }

    getComponent(): React.ComponentType<any> {
        /* TODO: Find why flow doesn't like this func. Mmight be because not all
           components have `sampleProps` defined. Might be able to narrow down
           what this function returns. */
        return components[this.getComponentName()];
    }

    render() {
        let Component = this.getComponent();

        if (!Component) {
            return (
                <div>No such component {this.getComponentName()}</div>
            );
        }

        // $FlowIgnore
        let variantNames = Object.keys(Component.sampleProps);
        let variants = variantNames.map(key => {
            let heading;

            if (variantNames.length > 1) {
                heading = <h1>{_s.titleize(key)}</h1>;
            }

            return (
                <div key={key}>
                    {heading}
                    {/* $FlowIgnore */}
                    <Component {...Component.sampleProps[key]} />
                </div>
            );
        });

        return (
            <div>
                {variants}
            </div>
        );
    }
}
