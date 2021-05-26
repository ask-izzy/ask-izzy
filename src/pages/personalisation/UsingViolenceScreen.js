/* @flow */

import * as React from "react";

import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Link from "../../components/Link";
import Gender from "./Gender";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import DfvDemographics from "./DfvDemographics";
import storage from "../../storage";

import type { searchRequest } from "../../iss";

class UsingViolenceScreen extends BaseStaticPersonalisation {
    get doneButtonLabel(): string {
        if (DfvDemographics.answer &&
            DfvDemographics.answer.indexOf("LGBTIQA+") > -1) {
            return "Continue";
        }

        return "Continue to all services";
    }

    static title = "Using violence";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "using-violence",
            heading: "Worried about your behaviour?",
            showBaseTextBox: true,
            baseTextBoxComponent: <DomesticViolenceLink/>,
        }
    );

    static summaryLabel = "Worried about your behaviour?";

    static showPage(): boolean {
        return Boolean(
            DfvDemographics.answer &&
            DfvDemographics.answer.indexOf("Using violence") > -1
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

    renderMensReferralService(): React.Element<any> {
        if (Boolean(Gender.answer) && Gender.answer === "Female") {
            return <React.Fragment/>;
        }

        // eslint-disable-next-line max-len
        const referralServiceLink = "/service/1190541-no-to-violence-men-s-referral-service";
        const referralServicePhone = "1300 766 491";
        const referralServiceChat = "https://ntv.org.au/get-help/";

        return (
            <h3>
                <Link to={referralServiceLink}>Men's referral service</Link> on
                {" "}
                {
                    this.props.mobileView ? (
                        <Link to={`tel:${referralServicePhone}`}>
                            { referralServicePhone }
                        </Link>
                    ) : (
                        `${ referralServicePhone }`
                    )
                }
                {" "}or chat online <Link to={referralServiceChat}>here</Link>.
            </h3>
        )
    }

    renderWomensReferralService(): React.Element<any> {
        if (Boolean(Gender.answer) && Gender.answer === "Male") {
            return <React.Fragment/>;
        }

        const referralServiceLink = "/service/634190-1800respect";
        const referralServicePhone = "1800 737 732";

        return (
            <h3>
                <Link to={referralServiceLink}>Women's referral service</Link>
                {" "}on{" "}
                {
                    this.props.mobileView ? (
                        <Link to={`tel:${referralServicePhone}`}>
                            { referralServicePhone }
                        </Link>
                    ) : (
                        `${ referralServicePhone }`
                    )
                }.
            </h3>
        )
    }

    renderContent(): React.Element<any> {
        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        Is your behaviour causing problems for your
                        relationships or family?
                    </h2>
                    <h2>
                        Are you using controlling behaviour or violence in your
                        relationships?
                    </h2>
                    <h3>
                        <strong>
                            Take the first steps to change today.
                        </strong>
                    </h3>
                    { this.renderMensReferralService() }
                    { this.renderWomensReferralService() }
                </div>
            </div>
        );
    }
}


export default MobileDetect(UsingViolenceScreen);
