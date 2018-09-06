/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import AreYouSafe from "./AreYouSafe";
import storage from "../../storage";
import OnlineSafetyLink from "../../components/OnlineSafetyLink";
import MobileDetect from "../../components/higherorder/MobileDetect";

class OnlineSafetyScreen extends BaseStaticPersonalisation {
    static title = "Help";

    static defaultProps = {
        name: "online-safety-screen",
        heading: "Everyone has the right to be safe",
        byline: "All of your answers are private and anonymous",
        showBaseTextBox: true,
        baseTextBoxComponent: <OnlineSafetyLink/>,
    };

    static summaryLabel = "Online safety screen";

    static showPage(): boolean {
        return !this.answer &&
        Boolean(AreYouSafe.answer) &&
        [
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
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        If you or someone else is in danger call{' '}
                        {
                            this.props.mobileView ? (
                                <a href="tel:000">000</a>
                            ) : (
                                "000"
                            )
                        }
                    </h2>
                    <h3>
                        If you don't feel safe in your life, call{' '}
                        <a href={link1800Respect}>1800 Respect</a> for
                        confidential counselling, support and services
                    </h3>
                    <h3>
                        <a href={link1800Respect}>1800 Respect</a> on{' '}
                        {
                            this.props.mobileView ? (
                                <a href={`tel:${number1800Respect}`}>
                                    {number1800Respect}
                                </a>
                            ) : (
                                `${ number1800Respect }`
                            )
                        }
                    </h3>
                </div>
            </div>
        );
    }
}

export default MobileDetect(OnlineSafetyScreen);
