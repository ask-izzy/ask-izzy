/* @flow */
import * as React from "react";

import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import PhoneTalk from "../../icons/phone-talk.svg";
import Link from "../../components/base/Link";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DfvDemographics from "./DfvDemographics";
import storage from "../../storage";

import type { serviceSearchRequest } from "../../iss/serviceSearch";

class Under18DomesticViolenceScreen extends BaseStaticPersonalisation {
    get doneButtonLabel(): string {
        const answer = DfvDemographics.savedAnswer
        if (
            answer && (
                answer.indexOf("LGBTIQA+") > -1 ||
                answer.indexOf("Using violence") > -1
            )
        ) {
            return "Continue";
        }

        return "Continue to all services";
    }

    static title = "Under 18 help";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "under-18-dfv",
            heading: "Under 18",
            showBaseTextBox: true,
            baseTextBoxComponent: <DomesticViolenceLink/>,
        }
    );

    static summaryLabel = "Under 18 Domestic Violence Information";

    static showPage(): boolean {
        return Boolean(
            DfvDemographics.savedAnswer?.includes("Under 18")
        );
    }

    static getSearch(request: serviceSearchRequest): ?serviceSearchRequest {
        return this.savedAnswer ? request : null;
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

    renderContent(): React.Element<any> {
        const linkService = "/service/120917-kids-helpline";
        const numberService = "1800 55 1800";
        const chatService =
            "https://kidshelpline.com.au/get-help/webchat-counselling";

        const linkWoah = "https://woah.org.au/";
        const linkYoungAndEsafe = "https://www.esafety.gov.au/educators/classroom-resources/young-and-esafe";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <PhoneTalk className="PhoneIcon" />
                    <h2>
                        Violence is never OK. It may be happening at home
                        with family or with someone you're dating.
                    </h2>
                    <p>
                        <Link to={linkService}>Kids Helpline</Link> can help.
                        To talk to someone privately{" "}
                        <Link to={`tel:${numberService}`}>
                            call {numberService}
                        </Link>
                        {" "} or <Link to={chatService}>chat online</Link>.
                        <br/>
                        To <Link to={linkWoah}>understand what family{" "}
                        violence is visit WOAH</Link>, or{" "}
                        <Link to={linkYoungAndEsafe}>Young & eSafe for
                            {" "}online safety advice</Link>
                    </p>
                </div>
            </div>
        );
    }
}


export default (MobileDetect(Under18DomesticViolenceScreen): any);
