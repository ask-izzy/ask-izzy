/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import { withDesign } from "storybook-addon-designs"

import AlertBanner from "./AlertBanner";

export default {
    title: "App Components/AlertBanner",
    component: AlertBanner,
    argTypes: ({}: {...}),
    decorators: [withDesign],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <AlertBanner {...args} />;
};

export const WarningWithBody: typeof Template = Template.bind({});
WarningWithBody.args = {
    alertLevel: "warn",
    title: <p><strong>COVID19 affected services</strong></p>,
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
};
WarningWithBody.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=715%3A2503",
    },
}

export const WarningWithBodyOpenByDefault: typeof Template = Template.bind({});
WarningWithBodyOpenByDefault.args = {
    alertLevel: "warn",
    defaultToOpen: true,
    title: <p><strong>COVID19 affected services</strong></p>,
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
};
WarningWithBodyOpenByDefault.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=746%3A181",
    },
}

export const InfoWithBody: typeof Template = Template.bind({});
InfoWithBody.args = {
    alertLevel: "info",
    title: <p><strong>COVID19 affected services</strong></p>,
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
};

export const InfoTitleWithLinkAndWithoutBody: typeof Template =
    Template.bind({});
InfoTitleWithLinkAndWithoutBody.args = {
    alertLevel: "info",
    title: <strong><a href="/covid-19-support">
        Get COVID19 help and information near you.
    </a></strong>,
};
InfoTitleWithLinkAndWithoutBody.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=746%3A182",
    },
}

export const InfoTitleWithoutLinkAndWithoutBody: typeof Template =
    Template.bind({});
InfoTitleWithoutLinkAndWithoutBody.args = {
    alertLevel: "info",
    title: <p>
        Get COVID19 help and information near you.
    </p>,
};

export const InvalidLevel: typeof Template = Template.bind({});
InvalidLevel.args = {
    alertLevel: "invalid level",
};
