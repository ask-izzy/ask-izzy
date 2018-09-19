/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Gender from "./Gender";
import MobileDetect from "../../components/higherorder/MobileDetect";

class UsingViolenceScreen extends BaseStaticPersonalisation {
    static title = "";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "using-violence",
            heading: "Worried about your behaviour?",
            byline: "All of your answers are private and anonymous",
            renderDoneButton: false,
        }
    );

    static summaryLabel = "Worried about your behaviour?";

    static showPage(): boolean {
        return true;
    }

    renderMensReferralService(): React.Element<any> {
        if (Boolean(Gender.answer) && Gender.answer === "Female") {
            return <React.Fragment/>;
        }

        // eslint-disable-next-line max-len
        const referralServiceLink = "/service/1190541-no-to-violence-men-s-referral-service";
        const referralServicePhone = "1300 766 491";
        const referralServiceChat = "http://www.ntv.org.au/get-help/live-chat/";

        return (
            <h3>
                <a href={referralServiceLink}>Men's referral service</a> on{' '}
                {
                    this.props.mobileView ? (
                        <a href={`tel:${referralServicePhone}`}>
                            { referralServicePhone }
                        </a>
                    ) : (
                        `${ referralServicePhone }`
                    )
                }
                {' '}or chat online <a href={referralServiceChat}>here</a>
            </h3>
        )
    }

    renderWomensReferralService(): React.Element<any> {
        if (Boolean(Gender.answer) && Gender.answer === "Male") {
            return <React.Fragment/>;
        }

        // eslint-disable-next-line max-len
        const referralServiceLink = "/service/634190-1800respect";
        const referralServicePhone = "1800 737 732";

        return (
            <h3>
                <a href={referralServiceLink}>Women's referral service</a> on
                {' '}
                {
                    this.props.mobileView ? (
                        <a href={`tel:${referralServicePhone}`}>
                            { referralServicePhone }
                        </a>
                    ) : (
                        `${ referralServicePhone }`
                    )
                }
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
                    <h3>
                        <strong>
                            Take the first steps to change today
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
