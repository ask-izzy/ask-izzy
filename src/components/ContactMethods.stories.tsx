import React, {ReactNode} from "react";

import ContactMethods from "@/src/components/ContactMethods.js";
import { ixaService, phoneableService } from "@/fixtures/services.js";


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