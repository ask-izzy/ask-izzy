/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import PhoneTalk from "../../icons/phone-talk.svg";
import AreYouSafe from "./AreYouSafe";
import storage from "../../storage";
import OnlineSafetyLink from "../../components/OnlineSafetyLink";
import MobileDetect from "../../components/higherorder/MobileDetect";

class OnlineSafetyScreen extends BaseStaticPersonalisation {
    doneButtonLabel = "OK - keep searching";

    static title = "Help";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "online-safety-screen",
            heading: "Everyone has the right to be safe",
            showBaseTextBox: true,
            baseTextBoxComponent: <OnlineSafetyLink/>,
        }
    );

    static summaryLabel = "Online safety screen";

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return !this.answer &&
            Boolean(AreYouSafe.answer) &&
            [
                "",
                "Yes",
                "(skipped)",
            ].indexOf(AreYouSafe.answer) === -1;
    }

    onDoneTouchTap(): void {
        storage.setItem(this.props.name, true);

        super.onDoneTouchTap();
    }

    static summaryLabel = "Online safety screen"

    renderContent(): React.Element<any> {
        const link1800Respect = "/service/634190-1800respect";
        const number1800Respect = "1800 737 732";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <PhoneTalk className="PhoneIcon" />
                    <h2>
                        If you or someone else is in danger call{" "}
                        {
                            this.props.mobileView ? (
                                <a href="tel:000">000</a>
                            ) : (
                                "000"
                            )
                        }
                    </h2>
                    <h3>
                        If you don't feel safe in your life, call{" "}
                        <a href={link1800Respect}>1800 Respect</a> on{" "}
                        {
                            this.props.mobileView ? (
                                <a className="phone-number"
                                    href={`tel:${number1800Respect}`}
                                >
                                    {number1800Respect}
                                </a>
                            ) : (
                                <span className="phone-number">
                                    {number1800Respect}
                                </span>
                            )
                        } for confidential counselling, support and services.
                    </h3>
                </div>
            </div>
        );
    }
}

export default MobileDetect(OnlineSafetyScreen);
