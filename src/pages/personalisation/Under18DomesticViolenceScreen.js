/* @flow */
import * as React from "react";

import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Link from "../../components/base/Link";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DfvDemographics from "./DfvDemographics";
import storage from "../../storage";

import type { SearchQueryChanges } from "../../iss/searchQueryBuilder";
import type {
    PersonalisationNonQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationNonQuestionPageDefaultProps = {
    ...BaseStaticPersonalisation.defaultProps,
    name: "under-18-dfv",
    heading: "Under 18",
    baseTextBoxComponent: <DomesticViolenceLink/>,
};
class Under18DomesticViolenceScreen extends BaseStaticPersonalisation {
    static defaultProps: PersonalisationNonQuestionPageDefaultProps =
        defaultProps;
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

    static getShouldIncludePage(): boolean {
        return Boolean(
            DfvDemographics.savedAnswer?.includes("Under 18")
        );
    }

    static getSearchQueryChanges(): SearchQueryChanges | null {
        return this.savedAnswer ? {} : null;
    }

    onDoneTouchTap(): void {
        storage.setItem(this.props.name, true);

        super.onDoneTouchTap();
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
                    <icons.PhoneTalk className="PhoneIcon" />
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
