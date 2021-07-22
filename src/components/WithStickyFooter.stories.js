/* @flow */

import type {Node, Element} from "React";
import React, { useEffect } from "react";

import WithStickyFooter from "./WithStickyFooter";
import FlatButton from "./FlatButton";
import ListItem from "./ListItem";
import icons from "../icons";
/* eslint-disable-next-line no-unused-vars */ // $FlowIgnore
import Style from "./WithStickyFooter.stories.scss";

export default {
    title: "Basic UI Components/WithStickyFooter",
    component: WithStickyFooter,
    decorators: [
        // Ensure page scroll is reset to the top when flipping between stories
        (Story: Object): Node => {
            useEffect(() => () => window.scrollTo(0, 0));
            return <Story />;
        },
        // Add ruler for demo purposes if no body content is supplied
        (Story: Object, { args, parameters }: Object): Node => {
            const mainContentHeight =
                parameters?.context?.mainContentHeight || 150;
            args.children = args.children ? (
                args.children
            ) : (
                <div className="ruler px">
                    {[...Array(mainContentHeight + 1)].map((val, i) => (
                        <div className="mark"
                            key={i}
                        />
                    ))}
                </div>
            );

            return <Story />;
        },
    ],
    args: {
        footerContents: (
            (<ul>
                <p>Line 1</p>
                <p>Line 2</p>
            </ul>: Element<"ul">)
        ),
    },
    parameters: {
        layout: "fullscreen",
    },
};

const Template = (args: Object): Element<"div"> => {
    (Template.args: any);
    const { children, ...remainingArgs } = args;

    return (
        <div className="WithStickyFooterStorybook">
            <WithStickyFooter {...remainingArgs}>
                {children}
            </WithStickyFooter>
        </div>
    );
};

export const JustTheFooter: typeof Template = Template.bind({});
JustTheFooter.args = {
    children: <></>,
};

export const FooterWithExampleRulerLargerThanViewPort: typeof Template =
    Template.bind({});

export const FooterWithExampleRulerSmallerThanViewPort: typeof Template =
    Template.bind({});
FooterWithExampleRulerSmallerThanViewPort.parameters = {
    context: {
        mainContentHeight: 20,
    },
};

export const FooterWithExampleList: typeof Template = Template.bind({});
FooterWithExampleList.args = {
    footerContents: (
        <FlatButton
            label="Example Button"
            style={{ margin: "1em" }}
            onClick={() => {}}
        />
    ),
    children: Object.keys(icons)
        .map(iconName => [iconName, icons[iconName]])
        .map(([iconName, Icon]) => (
            <ListItem leftIcon={<Icon />}
                key={iconName}
            >
                {iconName}
            </ListItem>
        )),
};
