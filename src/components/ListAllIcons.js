/* @flow */

import React from "react";
import icons from "../icons";

// This component is so icons can be viewed in the style guide
// http://localhost:8000/styleGuide/component/ListAllIcons

class ListAllIcons extends React.Component<void, void> {
    static sampleProps = {default: {}};

    render() {
        return (
            <ul>{Object.entries(icons).map(
                ([iconName, Icon]) =>
                    <li key={iconName}>
                        <Icon className="big" />
                        <br />
                        <span>{iconName}</span>
                    </li>
            )}</ul>
        );
    }
}

export default ListAllIcons;
