import React, {ReactNode} from "react";

import Accessibility from "@/src/components/Accessibility";
import getServiceFixture from "@/fixtures/factories/Service";
import { susansHouseServiceProps } from "@/fixtures/servicesProps";

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