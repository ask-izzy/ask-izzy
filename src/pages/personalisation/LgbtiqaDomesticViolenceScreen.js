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
                If you're LGBTIQA+ and worried about any of your
                relationships,
                {" "}<Link to={linkService}>W|Respect</Link>{" "}
                can help. Call W|Respect on
                {" "}<Link to={`tel:${phoneService}`}>
                    {phoneService}
                </Link> for counselling and support.
            </p>
        );
    }

    renderAustraliaWideService(): React.Element<any> {
        const linkService = "/service/1740955-qlife";
        const phoneService = "1800 184 527";
        const qLifeChat = "https://www.qlife.org.au/resources/chat";

        return (
            <p>
                If you're LGBTIQA+ and worried about any of your
                relationships,
                {" "}<Link to={linkService}>QLife</Link> can
                help. Call QLife on
                {" "}<Link to={`tel:${phoneService}`}>
                    {phoneService}
                </Link> or
                {" "}<Link to={qLifeChat}>chat online</Link> for
                counselling and support, 3pm – midnight every day.
            </p>
        );
    }

    renderContent(): React.Element<any> {
        const link1800Respect = "/service/634190-1800respect";
        const phone1800Respect = "1800 737 732";
        const chat1800Respect = "https://chat.1800respect.org.au/";
        const linkAcon = "http://www.anothercloset.com.au/";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        Everyone has the right to be safe and proud.<br />
                        Violence and abuse is never OK.
                    </h2>
                    {this.shouldShowVicService() ? this.renderVictoriaService()
                        : this.renderAustraliaWideService()}
                    <p>
                        Get information about
                        {" "}<Link to={linkAcon}>
                            domestic and family violence in
                            LGBTIQA+ relationships.
                        </Link>
                    </p>
                    <h3>
                        <strong>
                            You can also get 24-hour help from non-LGBTIQA+
                            specific services
                        </strong>
                    </h3>
                    <p>
                        Mainstream services like
                        {" "}<Link to={link1800Respect}>1800RESPECT</Link>
                        {" "}can also help if you are worried about unhealthy,
                        abusive or violent behaviour in any of your
                        relationships. Contact 1800RESPECT on
                        {" "}<Link to={`tel:${phone1800Respect}`}>
                            1800 737 732
                        </Link> or through their
                        {" "}<Link to={chat1800Respect}>online chat.</Link>
                    </p>
                </div>
            </div>
        );
    }
}


export default (MobileDetect(LgbtiqaDomesticViolenceScreen): any);
