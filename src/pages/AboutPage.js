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
                        Ask Izzy helps people who are homeless
                        or at risk of becoming
                        homeless to find the services they need,
                        right now and nearby.
                    </p>

                    <h3>Ask Izzy:</h3>
                    <ul>
                        <li>
                            is nationwide and free.
                        </li>
                        <li>
                            can help you find housing, meals,
                            health services, counselling, legal help,
                            addiction help and a whole lot more services.
                        </li>
                        <li>
                            lists more than 340 000 different services.
                        </li>
                        <li>
                            is available on phones, tablets and computers.
                        </li>
                    </ul>
                    <p>
                        We acknowledge the traditional custodians of this
                        land and pay our respects to their culture, their
                        people and elders past and present.
                    </p>
                </div>
            </div>
        );
    }

}

export default AboutPage;
