import React, {ReactNode} from "react";

import GoogleMapsLink from "@/src/components/GoogleMapsLink.js";
import { ixaService } from "@/fixtures/services.js";


export default {
    title: "Service Components/GoogleMapsLink",
    component: GoogleMapsLink
};

const Template = (args): ReactNode => {
    return <GoogleMapsLink {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: <div>Link text</div>,
    to: ixaService.location
};