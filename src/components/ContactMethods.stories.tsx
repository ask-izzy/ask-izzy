import React, {ReactNode} from "react";

import ContactMethods from "@/src/components/ContactMethods";
import { ixaService, phoneableService } from "@/fixtures/services";

export default {
    title: "Service Components/ContactMethods",
    component: ContactMethods
};

const Template = (args): ReactNode => {
    return <ContactMethods {...args} />;
};

export const BasicService = Template.bind({});
BasicService.args = {
    object: ixaService
};
export const ServiceWithLotsOfNumbers = Template.bind({});
ServiceWithLotsOfNumbers.args = {
    object: phoneableService
};