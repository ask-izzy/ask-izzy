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
                    <p>
                        Ask Izzy is a guide to homeless
                        support &amp; prevention services.
                    </p>
                    <p>
                        Ask Izzy was designed and built in Wurundjeri country.
                        We pay respect to the elders past and present here and
                        across Australia.
                    </p>
                </div>
            </div>
        );
    }

}

export default AboutPage;
