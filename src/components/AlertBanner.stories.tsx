import React, {ReactNode} from "react";
import { withDesign } from "storybook-addon-designs";

import AlertBanner from "@/src/components/AlertBanner.js";
import Link from "@/src/components/base/Link.js";

export default {
    title: "App Components/AlertBanner",
    component: AlertBanner,
    argTypes: ({} as Record<string, never>),
    decorators: [withDesign]
};

const Template = (args): ReactNode => {
    return <AlertBanner {...args} />;
};

export const WarningWithBody = Template.bind({});
WarningWithBody.args = {
    alertLevel: "warn",
    title: <p><strong>COVID19 affected services</strong></p>,
    body: <>
        <p>
            Services listed here may not be operating or limited.
            Contact services directly for up-to-date information.
        </p>
        <p>
            <Link to="/covid-19-support">
                Get COVID19 help and information near you.
            </Link>
        </p>
    </>
};
WarningWithBody.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=715%3A2503"
    }
};
export const WarningWithBodyOpenByDefault = Template.bind({});
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
            <Link to="/covid-19-support">
                Get COVID19 help and information near you.
            </Link>
        </p>
    </>
};
WarningWithBodyOpenByDefault.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=746%3A181"
    }
};
export const InfoWithBody = Template.bind({});
InfoWithBody.args = {
    alertLevel: "info",
    title: <p><strong>COVID19 affected services</strong></p>,
    body: <>
        <p>
            Services listed here may not be operating or limited.
            Contact services directly for up-to-date information.
        </p>
        <p>
            <Link to="/covid-19-support">
                Get COVID19 help and information near you.
            </Link>
        </p>
    </>
};
export const InfoTitleWithLinkAndWithoutBody = Template.bind({});
InfoTitleWithLinkAndWithoutBody.args = {
    alertLevel: "info",
    title: <strong><a href="/covid-19-support">
        Get COVID19 help and information near you.
    </a></strong>
};
InfoTitleWithLinkAndWithoutBody.parameters = {
    design: {
        type: "figma",
        // eslint-disable-next-line max-len
        url: "https://www.figma.com/file/bNWZa4jsWDhgBh94vJTJvD/Ask-Izzy-elements?node-id=746%3A182"
    }
};
export const InfoTitleWithoutLinkAndWithoutBody = Template.bind({});
InfoTitleWithoutLinkAndWithoutBody.args = {
    alertLevel: "info",
    title: <p>
        Get COVID19 help and information near you.
    </p>
};
export const InvalidLevel = Template.bind({});
InvalidLevel.args = {
    alertLevel: "invalid level"
};