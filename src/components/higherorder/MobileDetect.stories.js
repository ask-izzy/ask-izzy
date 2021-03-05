/* @flow */

import React from "react";

import MobileDetect from "./MobileDetect";

export default {
    title: "Basic UI Components/MobileDetect",
    component: MobileDetect,
};

const Template = (args: Object) => {
    class ExampleChildComponent
        extends React.Component<{mobileView: boolean}, void> {
        render() {
            const message = this.props.mobileView ?
                "Mobile view detected based on current window size"
                : "Desktop view detected based on current window size"
            return <div>{message}</div>
        }
    }

    const WrappedComponent = MobileDetect(ExampleChildComponent);

    return <WrappedComponent />
}

export const Example = Template.bind({});
