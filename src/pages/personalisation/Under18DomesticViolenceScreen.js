/* @flow */

import * as React from "react";

import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import Link from "../../components/Link";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DfvDemographics from "./DfvDemographics";
import storage from "../../storage";

import type { searchRequest } from "../../iss";

class Under18DomesticViolenceScreen extends BaseStaticPersonalisation {
    get doneButtonLabel(): string {
        const answer = DfvDemographics.answer
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

    static title = "Under 18";

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
            DfvDemographics.answer &&
            DfvDemographics.answer.indexOf("Under 18") > -1
        );
    }

    static getSearch(request: searchRequest): ?searchRequest {
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

    renderContent(): React.Element<any> {
        const linkService = "/service/120917-kids-helpline";
        const numberService = "1800 55 1800";
        const chatService = "https://kidshelpline.com.au/";

        const linkWoah = "https://woah.org.au/";
        const linkYoungAndEsafe = "https://www.esafety.gov.au/youngandesafe";

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneTalk className="PhoneIcon" />
                    <h2>
                        Violence is never OK. It may be happening at home
                        with family or with someone you're dating.
                    </h2>
                    <h3>
                        Call <Link to={linkService}>Kids Helpline</Link> on{" "}
                        {
                            this.props.mobileView ? (
                                <Link to={`tel:${numberService}`}>
                                    {numberService}
                                </Link>
                            ) : (
                                `${ numberService }`
                            )
                        }
                        {" "} or chat online <Link to={chatService}>here</Link>.
                    </h3>
                    <h3>
                        Visit <Link to={linkWoah}>WOAH</Link> or{" "}
                        <Link to={linkYoungAndEsafe}>Young & eSafe</Link> to
                        learn more.
                    </h3>
                </div>
            </div>
        );
    }
}


export default (MobileDetect(Under18DomesticViolenceScreen): any);
