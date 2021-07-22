/* @flow */

import type {Element} from "React";
import React from "react";
import LinkTo from "@storybook/addon-links/react"
import { storiesOf } from "@storybook/react";

import icons from "./index";

for (const name of Object.keys(icons)) {
    const Component = icons[name]
    const componentStories = storiesOf(`Icons/Generated/${name}`, module);
    const stories = [
        {
            name: "Big",
            className: "big",
        },
        {
            name: "Small",
            className: "small",
        },
        {
            name: "Inline",
            className: "inline-icon",
        },
        {
            name: "Default",
            className: "",
        },
    ]
    for (const story of stories) {
        componentStories.add(
            story.name,
            (args) => <Component {...args} />,
            {
                component: Component,
                args: {
                    className: story.className,
                },
                argTypes: {
                    className: {
                        control: {
                            type: "select",
                            options: stories.map(option => option.className),
                        },
                    },
                },
            }
        )
    }
}

export function ListAllIcons(): Element<"ul"> {
    const iconList = Object.keys(icons)
        .map(name => ({name, component: icons[name]}))
    return (
        <ul
            className="ListAllStories"
        >
            {iconList.map(({name, component: Icon}) =>
                <li key={name}>
                    <LinkTo kind={`Icons/Generated/${name}`}
                        story="Big"
                    >
                        <Icon className="big" />
                        <br />
                        <span>
                            {name.replace(
                                /((?:[a-z]|[A-Z]+)(?=[A-Z]))/g,
                                "$1​"
                            )}
                        </span>
                    </LinkTo>
                </li>
            )}
        </ul>
    );
}
