import React, {useEffect, useState} from "react";
import StaticPage from "../StaticPage";
import Covid19Card from "./Covid19Card";
import Phone from "../../components/Phone";
import {Link} from "react-router-dom";
import {states} from "./Covid19Service";
import {windowWidth} from "../../components/effects/WindowWidth";
import sendEvent from "../../google-tag-manager";
function Covid19() {

    const [mobileView, setMobileView] = useState(false);
    const width = windowWidth();

    useEffect(() => {
        setMobileView(width <= 768);
    }, [width])

    useEffect(() => {
        sendEvent({
            event: "categoryPageLoad",
            categoryName: "Covid-19",
            isTopical: true,
        });
        sendEvent({
            categoryName: undefined,
            isTopical: undefined,
        });
    }, [])

    return (

        <StaticPage
            title=""
            bannerName="money-help static"
            className="Covid19PageTrent"
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
                <a
                    href="https://www.health.gov.au/news/health-alerts/novel-coronavirus-2019-ncov-health-alert"
                    rel="noopener noreferer"
                    target="_blank"
                >Australian Department of Health website</a> for the latest
                medical advice, news and information.
            </p>

            <div className="separator"/>
            <h2>State Government Information</h2>
            <hr/>
            {states.map(state =>
                <div key={state.title}>
                    <Covid19Card
                        mobileView={mobileView}
                        {...state}
                    />
                    <hr/>
                </div>)}
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



export default Covid19
