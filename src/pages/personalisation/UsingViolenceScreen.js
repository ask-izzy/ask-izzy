/* @flow */
import * as React from "react";

import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Link from "../../components/base/Link";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import DfvDemographics from "./DfvDemographics";
import storage from "../../storage";

import type { serviceSearchRequest } from "../../iss/serviceSearch";

class UsingViolenceScreen extends BaseStaticPersonalisation {
    get doneButtonLabel(): string {
        if (DfvDemographics.savedAnswer?.includes("LGBTIQA+")) {
            return "Continue";
        }

        return "Continue to all services";
    }

    static title = "Using violence";

    static defaultProps = {
        ...BaseStaticPersonalisation.defaultProps,
        name: "using-violence",
        heading: "Worried about your behaviour?",
        showBaseTextBox: true,
        baseTextBoxComponent: <DomesticViolenceLink/>,
    };

    static getShouldIncludePage(): boolean {
        return Boolean(
            DfvDemographics.savedAnswer?.includes("Using violence")
        );
    }

    static getSearch(request: serviceSearchRequest): ? serviceSearchRequest {
        return this.savedAnswer ? request : null;
    }

    onDoneTouchTap(): void {
        storage.setItem(this.props.name, true);

        super.onDoneTouchTap();
    }

    renderContent(): React.Element<any> {
        const referralServicePhone = "1800737732";
        const referralServiceChat = "https://ntv.org.au/get-help/";
        const link1800Respect = "/service/634190-1800respect";
        const onlineChat = "https://chat.1800respect.org.au/"

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
                        Take the first steps to change today.
                    </h3>
                    <p>
                        Get anonymous and confidential{" "}
                        <Link to={referralServiceChat}>
                            telephone and online counselling, information{" "}
                            and referral for men
                        </Link>
                        {" "}with concerns about their anger,
                        violence and abuse.
                    </p>
                    <p>
                        If you are worried about unhealthy, abusive or
                        violent behaviour in any of your relationships,{" "}
                        <Link to={link1800Respect}>1800RESPECT</Link>
                        {" "}could help. Contact 1800RESPECT on{" "}
                        <Link to={`tel:${referralServicePhone}`}>
                            1800 737 732
                        </Link>
                        {" "}or through their{" "}
                        <Link to={onlineChat}>online chat</Link>.
                    </p>
                </div>
            </div>
        );
    }
}


export default (MobileDetect(UsingViolenceScreen): any);
