/* @flow */

import React from "react";
import components from "../components";
import _s from "underscore.string";

export default class StyleGuideItem extends React.Component {
    static propTypes = {
        params: React.PropTypes.object,
    };

    constructor(props: Object) {
        super(props);
    }

    getComponentName(): string {
        return this.props.params.componentName;
    }

    getComponent(): React.Component {
        return components[this.getComponentName()];
    }

    render() {
        let Component = this.getComponent();

        if (!Component) {
            return (
                <div>No such component {this.getComponentName()}</div>
            );
        }

        let variantNames = Object.keys(Component.sampleProps);
        let variants = variantNames.map(key => {
            let heading;

            if (variantNames.length > 1) {
                heading = <h1>{_s.titleize(key)}</h1>;
            }

            return (
                <div key={key}>
                    {heading}
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
