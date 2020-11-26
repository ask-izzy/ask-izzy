/* @flow */

import * as React from "react";
import { Link } from "react-router-dom";
import components from "../components";

export default class StyleGuideList extends React.Component<{}, void> {
    render() {
        const componentsList = Object
            .keys(components)
            .map(name => ({name, component: components[name]}))
            .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
        return (
            <ul>{componentsList.map(({name, component}) =>
                <li key={name}>
                    <Link
                        to={`/styleGuide/component/${name}`}
                    >
                        {name}
                    </Link>{" "}
                    {!component.sampleProps && "(No sample props)"}
                </li>
            )}</ul>
        );
    }
}
