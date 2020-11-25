/* @flow */

import * as React from "react";
import icons from "../icons";

// This component is so icons can be viewed in the style guide
// http://localhost:8000/styleGuide/component/ListAllIcons


class ListAllIcons extends React.Component<void, void> {
    static sampleProps = {default: {}};

    render() {
        const iconList = Object.keys(icons)
            .map(name => ({name, component: icons[name]}))
        return (
            <ul>{iconList.map(({name, component: Icon}) =>
                <li key={name}>
                    <Icon className="big" />
                    <br />
                    <span>{name}</span>
                </li>
            )}</ul>
        );
    }
}

export default ListAllIcons;
