/* @flow */

import React, {useEffect} from "react";

import FloatFromBottom from "./FloatFromBottom";
/* eslint-disable-next-line no-unused-vars */ // $FlowIgnore
import Style from "./FloatFromBottom.stories.scss";

export default {
    title: "Basic UI Components/FloatFromBottom",
    component: FloatFromBottom,
    decorators: [
        (Story: Object, {parameters}: Object) => {
            const containerHeight = parameters?.context?.containerHeight || 150
            return <div className="FloatFromBottomStorybook">
                <div className="ruler px">
                    {[...Array(containerHeight + 1)].map((val, i) =>
                        <div className="mark"
                            key={i}
                        />
                    )}
                </div>
                <Story/>
            </div>
        },
        (Story: Object) => {
            useEffect(() => () => window.scrollTo(0, 0))
            return <Story/>
        },
    ],
};

const Template = (args: Object) => <FloatFromBottom {...args} />;

export const WithoutContainerOffset = Template.bind({});
WithoutContainerOffset.args = {
    children: <>
        <p>Line 1</p>
        <p>Line 2</p>
    </>,
};

export const WithContainerOffset = Template.bind({});
WithContainerOffset.args = {
    includeOffsetElement: true,
    children: <>
        <p>Line 1</p>
        <p>Line 2</p>
    </>,
};

export const ContainerFitsOnScreen = Template.bind({});
ContainerFitsOnScreen.args = {
    children: <>
        <p>Line 1</p>
        <p>Line 2</p>
    </>,
};
ContainerFitsOnScreen.parameters = {
    context: {
        containerHeight: 50,
    },
};