/* @flow:disable */

import React from "react";

const MobileDetect = OldComponent => {
    let isMobile;

    if (typeof window !== "undefined") {
        isMobile = window.innerWidth <= 768;
    } else {
        isMobile = false;
    }

    return class extends OldComponent {
        render() {
            return (
                <OldComponent
                    {...this.props}
                    mobileView={isMobile}
                />
            );
        }
    }
}


export default MobileDetect;
