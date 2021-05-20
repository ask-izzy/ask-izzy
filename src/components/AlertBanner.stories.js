/* @flow */
import React from "react";
import { withDesign } from "storybook-addon-designs"

import AlertBanner from "./AlertBanner";

export default {
    title: "App Components/AlertBanner",
    component: AlertBanner,
    argTypes: {},
    decorators: [withDesign],
    args: {
        title: "COVID19 affected services",
        body: <>
            <p>
                Services listed here may not be operating or limited.
                Contact services directly for up-to-date information.
            </p>
            <p>
                <a href="/covid-19-support">
                    Get COVID19 help and information near you.
                </a>
            </p>
        </>,
    },
};

const Template = (args: Object) => <AlertBanner {...args} />;

export const WarningWithBody = Template.bind({});
WarningWithBody.args = {
    alertLevel: "warn",
};
WarningWithBody.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=715%3A2503",
    },
}

export const WarningWithBodyOpenByDefault = Template.bind({});
WarningWithBodyOpenByDefault.args = {
    alertLevel: "warn",
    defaultToOpen: true,
};
WarningWithBodyOpenByDefault.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=746%3A181",
    },
}

export const InfoWithBody = Template.bind({});
InfoWithBody.args = {
    alertLevel: "info",
};

export const InfoWithoutBody = Template.bind({});
InfoWithoutBody.args = {
    alertLevel: "info",
    title: <a href="/covid-19-support">
        Get COVID19 help and information near you.
    </a>,
    body: undefined,
};
InfoWithoutBody.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=746%3A182",
    },
}

export const InvalidLevel = Template.bind({});
InvalidLevel.args = {
    alertLevel: "invalid level",
};
