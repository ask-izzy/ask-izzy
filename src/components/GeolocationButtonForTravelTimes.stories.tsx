import React, {ReactNode} from "react";

import GeolocationButtonForTravelTimes from "@/src/components/GeolocationButtonForTravelTimes.js";


export default {
    title: "Basic UI Components/Geolocation Button For Travel Times",
    component: GeolocationButtonForTravelTimes,
    argTypes: {
        showMessage: {
            control: {
                type: "boolean"
            }
        }
    }
};

const Template = (args): ReactNode =>
    <GeolocationButtonForTravelTimes {...args} />;

export const Example = Template.bind({});
Example.args = {
    showMessage: false
};