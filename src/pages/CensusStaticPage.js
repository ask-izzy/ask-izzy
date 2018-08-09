/* @flow */
/* eslint-disable max-len */

import React from "react";
import PropTypes from "proptypes";
import Phone from "../components/Phone";
import Web from "../components/Web";
import AppBar from "../components/AppBar";
import BoxedText from "../components/BoxedText";
import BoxedTextDivider from "../components/BoxedTextDivider";
import Spacer from "../components/Spacer";

export default class CensusStaticPage extends React.Component<{}> {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    render() {
        let back = () => this.context.router.goBack();

        return (
            <div
                className="CensusStaticPage"
            >
                <AppBar
                    title="2016 Census"
                    onBackTouchTap={back}
                />
                <div className="description">
                    <h2>August 9th 2016 is Census Night</h2>

                    <p>
                        The Census is a snapshot of everyone in Australia.
                        It is run by the ABS every five years.
                    </p>
                    <p>
                        Census data is used to plan the services we all use.
                        Services like housing, healthcare, and transport.
                    </p>
                    <p>
                        It is important that everyone in Australia be counted
                        wherever they are on Tuesday August 9. This includes
                        people with no fixed address.
                    </p>
                    <p>
                        There will be people at drop in centres, food vans and
                        other services helping people who are sleeping rough,
                        staying temporarily with friends or family, living in
                        boarding houses or staying in hostels to do the Census.
                    </p>
                    <p>
                        If you have no fixed address, or are couch surfing,
                        please write “none” in the suburb/locality box for the
                        usual address question.
                    </p>
                    <p>
                        Your personal information is not shared with anyone else.
                    </p>
                    <p>
                        If you need more information or didn’t complete a form
                        please call us on <a href="tel:1300214531">1300 214 531</a>
                    </p>
                </div>

                <BoxedTextDivider />
                <BoxedText>
                    <div className="census-opening-times">
                        Census is Tuesday August 9.
                        You can still participate up until mid-September.
                    </div>

                    <Spacer />
                    <Phone
                        comment=""
                        kind="phone"
                        number="1300 214 531"
                    />
                    <Web url="http://help.census.abs.gov.au/sites/default/files/Census_Public/pdf/HOMELESSNESS_WEB.pdf" />
                </BoxedText>
            </div>
        );
    }
}
