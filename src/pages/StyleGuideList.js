/* @flow */

import React from "react";

import Link from "../components/Link";
import components from "../components";

export default class StyleGuideList extends React.Component<{}, void> {
    render() {
        return (
            <ul>
                {Object.keys(components).sort().map(this.renderItem)}
            </ul>
        );
    }

    renderItem(componentName: string) {
        return (
            <Link
                to={`/styleGuide/component/${componentName}`}
                key={componentName}
                style={{clear: "both", float: "left"}}
            >{componentName}</Link>
        );
    }
}
