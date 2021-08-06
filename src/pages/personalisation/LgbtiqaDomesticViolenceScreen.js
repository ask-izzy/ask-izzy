/* @flow */
import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Link from "../../components/Link";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import DfvDemographics from "./DfvDemographics";
import Location from "./Location"
import storage from "../../storage";

import type { searchRequest } from "../../iss";

class LgbtiqaDomesticViolenceScreen extends BaseStaticPersonalisation {
    doneButtonLabel = "Continue to all services";

    static title = "LGBTIQA+ help";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "lgbtiqa-domestic-violence",
            heading: "LGBTIQA+",
            showBaseTextBox: true,
            baseTextBoxComponent: <DomesticViolenceLink/>,
        }
    );

    static summaryLabel = "LGBTIQA+";

    static breadcrumbAnswer(): ?string {
        switch (this.answer) {
        case true:
            return "Safe";
        case false:
            return "Not safe";
        default:
            this.answer;
        }
    }

    static showPage(): boolean {
        return Boolean(
            DfvDemographics.answer &&
            DfvDemographics.answer.indexOf("LGBTIQA+") > -1
        );
    }

    static getSearch(request: searchRequest): ? searchRequest {
        return this.answer ? request : null;
    }

    onDoneTouchTap(): void {
        storage.setItem(this.props.name, true);

        super.onDoneTouchTap();
    }

    static showInSummary(): boolean {
        return false;
    }

    static staticShowPage(): boolean {
        return true;
    }

    shouldShowVicService(): boolean {
        const LocationAnswer = Location.answer.split(", ");

        return ["Victoria", "VIC"].indexOf(LocationAnswer[1]) > -1;
    }

    renderVictoriaService(): React.Element<any> {
        const linkService = "/service/4000053-with-respect";
        const phoneService = "1800 542 847";

        return (
            <p>
                Call <Link to={linkService}>1800LGBTIQ</Link> on{" "}
                {
                    this.props.mobileView ? (
                        <Link to={`tel:${phoneService}`}>
                            { phoneService }
                        </Link>
                    ) : (
                        `${phoneService}`
                    )
                }.
            </p>
        );
    }

    renderAustraliaWideService(): React.Element<any> {
        const linkService = "/service/1740955-qlife";
        const phoneService = "1800 184 527";

        return (
            <p>
                Call <Link to={linkService}>QLife</Link> on{" "}
                {
                    this.props.mobileView ? (
                        <Link to={`tel:${phoneService}`}>
                            { phoneService }
                        </Link>
                    ) : (
                        `${phoneService}`
                    )
                } or chat online.
            </p>
        );
    }

    renderContent(): React.Element<any> {
        const link1800Respect = "/service/634190-1800respect";
        const phone1800Respect = "1800 737 732";
        const wRespectPhone = "1800 542 847";
        const wRespect = "/service/4000053-with-respect";
        const linkAcon = "http://www.anothercloset.com.au/";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        Everyone has the right to be safe and proud.<br />
                        Violence and abuse is never OK.
                    </h2>
                    <p>
                        If you're LGBTIQA+ and worried about any of your
                        relationships, <Link to={wRespect}>
                        W | Respect</Link> can
                        help. Call W | Respect on{" "}
                        <Link to={`tel:${wRespectPhone}`}>{wRespectPhone}</Link>
                        for counselling and support.
                    </p>
                    <p>
                        Get information about
                        <Link to={linkAcon}>
                            domestic and family violence in
                            LGBTIQ relationships.
                        </Link>
                    </p>
                    <h3>
                        <strong>
                            You can also get help from non-LGBTIQA+
                            specific services
                        </strong>
                    </h3>
                    <p>
                        Help and services are available from LGBTIQA+ services.
                    </p>
                    {
                        this.shouldShowVicService() ?
                            this.renderVictoriaService()
                            : this.renderAustraliaWideService()
                    }
                    <p>
                        Learn more about LGBTIQA+ family violence at{" "}
                        <Link to={linkAcon}>
                            ‘Another Closet’
                        </Link>.
                    </p>
                    <p>
                        Everyone has the right to access mainstream services.
                    </p>
                    <p>
                        Call <Link to={link1800Respect}>1800Respect</Link> on
                        {" "}
                        {
                            this.props.mobileView ? (
                                <Link to={`tel:${phone1800Respect}`}>
                                    { phone1800Respect }
                                </Link>
                            ) : (
                                `${phone1800Respect}`
                            )
                        }.
                    </p>
                </div>
            </div>
        );
    }
}


export default (MobileDetect(LgbtiqaDomesticViolenceScreen): any);
