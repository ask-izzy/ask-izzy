/* $FlowIgnore */

import React from "react";

const MobileDetect = OldComponent => {
    return class extends OldComponent {
        _mobileView: ?boolean;

        componentDidMount(): void {
            if (typeof window !== "undefined") {
                this._updateMobileSize();

                window.addEventListener(
                    "resize",
                    this._updateMobileSize.bind(this)
                );
            }
        }

        componentWillUnmount(): void {
            if (super.componentWillUnmount) {
                super.componentWillUnmount();
            }

            if (typeof window !== "undefined") {
                window.removeEventListener(
                    "resize",
                    this._updateMobileSize.bind(this)
                );
            }
        }

        _updateMobileSize(): void {
            let isMobile = false;

            if (typeof window !== "undefined") {
                isMobile = window.innerWidth <= 768;
            }

            if (isMobile !== this._mobileView) {
                this._mobileView = isMobile;
                this.forceUpdate();
            }
        }

        render() {
            return (
                <OldComponent
                    {...this.props}
                    mobileView={this._mobileView}
                />
            );
        }
    }
}


export default MobileDetect;
