import React, {ReactNode} from "react";

import Accessibility from "@/src/components/Accessibility.js";
import getServiceFixture from "@/fixtures/factories/Service.js";
import { susansHouseServiceProps } from "@/fixtures/servicesProps.js";

export default {
    title: "Service Components/Accessibility",
    component: Accessibility,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => {
    return <Accessibility {...args} />;
};

export const ServiceWithFullAccess = Template.bind({});
ServiceWithFullAccess.args = {
    service: getServiceFixture({ ...susansHouseServiceProps,
        accessibility: "fullaccess"
    })
};
export const ServiceWithAccess = Template.bind({});
ServiceWithAccess.args = {
    service: getServiceFixture({ ...susansHouseServiceProps,
        accessibility: "access"
    })
};
export const ServiceWithNoAccess = Template.bind({});
ServiceWithNoAccess.args = {
    object: getServiceFixture({ ...susansHouseServiceProps,
        accessibility: "noaccess"
    })
};