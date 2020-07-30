/* @flow */
/* eslint-disable max-len */

import React from "react";
import { Link } from "react-router";
import StaticPage from "./StaticPage";
import PropTypes from "proptypes";

import storage from "../storage";

export default class HomelessFinanceStaticPage extends React.Component<{}> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    confirmConsent(hasConsented: boolean): void {
        storage.setItem('consensual-user-tracking', hasConsented)
        this.context.router.push(
            '/',
        );
        location.reload()
    }

    render() {
        return (
            <StaticPage
                title="User Tracking Consent Request"
                bannerName="user-tracking-consent-request static"
            >
                <h1>Do you consent to having your session tracked for user experience research purposes?</h1>
                <button onClick={this.confirmConsent.bind(this, true)}>
                    Yes, allow tracking for research purposes
                </button>
                <button onClick={this.confirmConsent.bind(this, false)}>No, please do not track me</button>

            </StaticPage>
        );
    }
}
