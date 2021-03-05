/* @flow */

import React from "react";

import icons from "./index";

import { storiesOf } from "@storybook/react";
for (const name of Object.keys(icons)) {
    const Component = icons[name]
    const componentStories = storiesOf(`Icons/Generated/${name}`, Component);
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
            () => <Component className={story.className} />
        )
    }
}