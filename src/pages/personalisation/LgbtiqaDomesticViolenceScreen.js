/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import DfvDemographics from "./DfvDemographics";
import Location from "./Location"
import storage from "../../storage";

import type { searchRequest } from "../../iss";

class LgbtiqaDomesticViolenceScreen extends BaseStaticPersonalisation {
    doneButtonLabel = "Continue to all services";

    static title = "LGBTIQA+";

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

    static showPage(): boolean {
        return DfvDemographics.answer &&
            DfvDemographics.answer.indexOf("LGBTIQA+") > -1;
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
            <h3>
                Call <a href={linkService}>1800LGBTIQ</a> on{" "}
                {
                    this.props.mobileView ? (
                        <a href={`tel:${phoneService}`}>
                            { phoneService }
                        </a>
                    ) : (
                        `${phoneService}`
                    )
                }.
            </h3>
        );
    }

    renderAustraliaWideService(): React.Element<any> {
        const linkService = "/service/1740955-qlife";
        const phoneService = "1800 184 527";

        return (
            <h3>
                Call <a href={linkService}>QLife</a> on{" "}
                {
                    this.props.mobileView ? (
                        <a href={`tel:${phoneService}`}>
                            { phoneService }
                        </a>
                    ) : (
                        `${phoneService}`
                    )
                } or chat online.
            </h3>
        );
    }

    renderContent(): React.Element<any> {
        const link1800Respect = "/service/634190-1800respect";
        const phone1800Respect = "1800 737 732";
        const linkAcon = "http://www.anothercloset.com.au/";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        Everyone has the right to be safe and proud.<br />
                        Violence and abuse is never OK.
                    </h2>
                    <h3>
                        Help and services are available from LGBTIQA+ services.
                    </h3>
                    {
                        this.shouldShowVicService() ?
                            this.renderVictoriaService()
                            : this.renderAustraliaWideService()
                    }
                    <h3>
                        Learn more about LGBTIQA+ family violence at{" "}
                        <a href={linkAcon}>
                            ‘Another Closet’
                        </a>.
                    </h3>
                    <h3>
                        Everyone has the right to access mainstream services.
                    </h3>
                    <h3>
                        Call <a href={link1800Respect}>1800Respect</a> on{" "}
                        {
                            this.props.mobileView ? (
                                <a href={`tel:${phone1800Respect}`}>
                                    { phone1800Respect }
                                </a>
                            ) : (
                                `${phone1800Respect}`
                            )
                        }.
                    </h3>
                </div>
            </div>
        );
    }
}


export default MobileDetect(LgbtiqaDomesticViolenceScreen);
