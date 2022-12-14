/* eslint-disable react/display-name */
import React, {useEffect, ReactNode} from "react";

import WithStickyFooter from "@/src/components/WithStickyFooter";
import FlatButton from "@/src/components/FlatButton";
import ListItem from "@/src/components/ListItem";
import icons from "@/src/icons";

export default {
    title: "Basic UI Components/WithStickyFooter",
    component: WithStickyFooter,
    decorators: [// Ensure page scroll is reset to the top when flipping between stories
        (Story): ReactNode => {
            useEffect(() => () => window.scrollTo(0, 0));
            return <Story />;
        }, // Add ruler for demo purposes if no body content is supplied
        (Story, {
            args,
            parameters
        }: Record<string, any>): ReactNode => {
            const mainContentHeight = parameters?.context?.mainContentHeight || 150;
            args.children = args.children ? args.children : <div className="ruler px">
                {[...Array(mainContentHeight + 1)].map(
                    (val, i) => (
                        <div
                            className="mark"
                            key={i}
                        />
                    )
                )}
            </div>;
            return <Story />;
        }],
    args: {
        footerContents: (
            <ul>
                <p>Line 1</p>
                <p>Line 2</p>
            </ul>
        )
    },
    parameters: {
        layout: "fullscreen"
    }
};

const Template = (args) => {
    const {
        children,
        ...remainingArgs
    } = args;
    return <div className="WithStickyFooterStorybook">
        <WithStickyFooter {...remainingArgs}>
            {children}
        </WithStickyFooter>
    </div>;
};

export const JustTheFooter = Template.bind({});
JustTheFooter.args = {
    children: <></>
};
export const FooterWithExampleRulerLargerThanViewPort = Template.bind({});
export const FooterWithExampleRulerSmallerThanViewPort = Template.bind({});
FooterWithExampleRulerSmallerThanViewPort.parameters = {
    context: {
        mainContentHeight: 20
    }
};
export const FooterWithExampleList = Template.bind({});
FooterWithExampleList.args = {
    footerContents:
        <FlatButton
            label="Example Button"
            style={{
                margin: "1em"
            }}
            onClick={() => undefined}
        />,
    children: Object.keys(icons).map(iconName => [iconName, icons[iconName]]).map(
        ([iconName, Icon]) =>
            <ListItem
                leftIcon={<Icon />}
                key={iconName}
            >
                {iconName}
            </ListItem>
    )
};