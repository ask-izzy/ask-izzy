/* @flow */

import React from "react";
import { Link } from "react-router-dom";
import components from "../components";

export default class StyleGuideList extends React.Component<{}, void> {
    render() {
        const componentsList = Object
            .entries(components)
            .map(item => {return {name: item[0], component: item[1]}})
            .sort((a, b) => a.name.localeCompare(b.name))
        return (
            <ul>{componentsList.map(component =>
                <li key={component.name}>
                    <Link
                        to={`/styleGuide/component/${component.name}`}
                    >
                        {component.name}
                    </Link>{" "}
                    {/* flow:disable */}
                    {!component.component.sampleProps && "(No sample props)"}
                </li>
            )}</ul>
        );
    }
}
