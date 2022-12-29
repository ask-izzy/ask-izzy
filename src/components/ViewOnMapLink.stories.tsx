import React, {ReactNode} from "react";

import ViewOnMapLink from "@/src/components/ViewOnMapLink.js";
import { addGoogleMapsScript } from "@/src/storybook/decorators.js";

export default {
    title: "App Components/ViewOnMapLink",
    component: ViewOnMapLink,
    decorators: [addGoogleMapsScript]
};

const Template = (args): ReactNode => {
    return <ViewOnMapLink {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    to: "/"
};