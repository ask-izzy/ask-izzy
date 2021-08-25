/* @flow */
import * as React from "react";

import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Link from "../../components/Link";
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
            heading: "Everyone has the right to be safe.",
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
        const onlineChat = "https://chat.1800respect.org.au/";
        const number1800Respect = "1800 737 732";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        If you or someone else is in danger call{" "}
                        {
                            this.props.mobileView ? (
                                <Link to="tel:000">000</Link>
                            ) : (
                                "000"
                            )
                        }.
                    </h2>
                    <p>
                        If you are worried about unhealthy,{" "}
                        abusive or violent behaviour in any{" "}
                        of your relationships,{" "}
                        <Link to={link1800Respect}>1800RESPECT</Link>
                        {" "}could help. Contact 1800RESPECT on
                    </p>
                    <span>
                        <Link className="phone-number"
                            to={`tel:${number1800Respect}`}
                        >
                            {number1800Respect}
                        </Link> or through their{" "}
                    </span>
                    <span>
                        <Link to={onlineChat}>
                            online chat.
                        </Link>
                    </span>
                </div>
            </div>
        );
    }
}

export default (MobileDetect(OnlineSafetyScreen): any);
