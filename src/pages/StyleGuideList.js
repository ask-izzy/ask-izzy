/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import Link from "../components/Link";
import components from "../components";

export default class StyleGuideList extends React.Component<{}, void> {
    render(): ReactElement<"ul"> {
        return (
            <ul>
                {Object.keys(components).sort().map(this.renderItem)}
            </ul>
        );
    }

    renderItem(componentName: string): ReactNode {
        return (
            <Link
                to={`/styleGuide/component/${componentName}`}
                key={componentName}
                style={{clear: "both", float: "left"}}
            >{componentName}</Link>
        );
    }
}
