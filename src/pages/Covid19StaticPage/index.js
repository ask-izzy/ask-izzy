/* @flow */

import type {Node as ReactNode} from "React";
import React, {useEffect, useState} from "react";
import StaticPage from "../StaticPage";
import Covid19Card from "./Covid19Card";
import Phone from "../../components/Phone";
import Link from "../../components/Link";
import {states} from "./Covid19Service";
import {windowWidth} from "../../effects/WindowWidth";

function Covid19StaticPage(): ReactNode {

    const [mobileView, setMobileView] = useState(false);
    const width = windowWidth();

    useEffect(() => {
        setMobileView(width <= 768);
    }, [width])

    return (

        <StaticPage
            title=""
            bannerName="money-help static"
            className="Covid19Page"
            bannerPrimary="Coronavirus (COVID-19) information and services"
            bannerSecondary=""
        >
            <div className="nationalHotline">
                <h2>COVID-19 National Hotline</h2>
                The Coronavirus Health Information Line provides general
                information relating to coronavirus (COVID-19) for the
                general community. The line operates 24 hours a day, seven
                days a week.
                <Phone
                    number="1800 020 080"
                    comment=""
                    kind=""
                />
            </div>

            <h2>Federal Government Information</h2>
            <p>
                For information from the federal government please visit
                the{" "}
                <Link
                    to="https://www.health.gov.au/news/health-alerts/novel-coronavirus-2019-ncov-health-alert"
                >Australian Department of Health website</Link> for the latest
                medical advice, news and information.
            </p>

            <div className="separator"/>
            <h2>State Government Information</h2>
            <hr/>
            {states.map(state => <>
                    <Covid19Card
                        key={state.title}
                        mobileView={mobileView}
                        {...state}
                    />
                    <hr/>
                </>
            )}
            <hr/>
            <div className="izzyCanHelp">
                <h2>Ask Izzy can help</h2>
                <p>
                    You can use Ask Izzy to{" "}
                    <Link to="/search/coronavirus/personalise">
                        find nearby clinics
                    </Link> providing services and testing specific to
                    coronavirus.
                </p>
            </div>
        </StaticPage>
    )
}

export default Covid19StaticPage
