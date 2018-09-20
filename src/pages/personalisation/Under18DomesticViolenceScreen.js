/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import MobileDetect from "../../components/higherorder/MobileDetect";
import ServiceList from "./ServiceList";

class Under18DomesticViolenceScreen extends BaseStaticPersonalisation {
    static title = " ";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "under-18-dfv",
            heading: "Under 18",
            byline: "All of your answers are private and anonymous",
            renderDoneButton: false,
            showBaseTextBox: true,
            baseTextBoxComponent: <DomesticViolenceLink/>,
        }
    );

    static summaryLabel = "Under 18 Domestic Violence Information";

    static showPage(): boolean {
        return ServiceList.answer === "Children's support and protection";
    }

    renderContent(): React.Element<any> {
        const linkService = "/service/634190-1800respect";
        const numberService = "1800 551 800";
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
                        Call <a href={linkService}>Kid's Helpline</a> on{" "}
                        {
                            this.props.mobileView ? (
                                <a href={`tel:${numberService}`}>
                                    {numberService}
                                </a>
                            ) : (
                                `${ numberService }`
                            )
                        }
                        {" "} or chat online <a href={chatService}>here</a>
                    </h3>
                    <h3>
                        Visit <a href={linkWoah}>WOAH</a> or{" "}
                        <a href={linkYoungAndEsafe}>Young and E-SAFE</a> to
                        learn more
                    </h3>
                </div>
            </div>
        );
    }
}


export default MobileDetect(Under18DomesticViolenceScreen);
