/* @flow */

import React from "react";
import AlertBanner from "./AlertBanner";

export default {
    title: "App Components/AlertBanner",
    component: AlertBanner,
    argTypes: {},
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

export const WarningWithBodyOpenByDefault = Template.bind({});
WarningWithBodyOpenByDefault.args = {
    alertLevel: "warn",
    defaultToOpen: true,
};

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

export const InvalidLevel = Template.bind({});
InvalidLevel.args = {
    alertLevel: "invalid level",
};
