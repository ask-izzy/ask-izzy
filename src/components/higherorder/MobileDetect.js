/* flow:disable */

import React from "react";

export default class MobileDetect extends React.Component<{}> {
    _mobileView: ?boolean;

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

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
            <React.Fragment>
                {this.props.children({ isMobile: this._mobileView })}
            </React.Fragment>
        );
    }
}
