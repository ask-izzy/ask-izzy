/* @flow */

import React from "react";
import components from "../components";

class AboutPage extends React.Component {

    render(): ReactElement {
        let history = this.props.history;

        return (
            <div className="AboutPage">
                <components.AppBar
                    title="About Ask Izzy"
                    onBackTouchTap={history.goBack.bind(history)}
                />

                <div className="body">
                    Ask Izzy is a guide to homeless
                    support & prevention services.
                </div>
            </div>
        );
    }

}

export default AboutPage;
