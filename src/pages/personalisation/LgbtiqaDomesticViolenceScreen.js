/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import MobileDetect from "../../components/higherorder/MobileDetect";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import DfvDemographics from "./DfvDemographics";

class LgbtiqaDomesticViolenceScreen extends BaseStaticPersonalisation {
    static title = " ";

    static defaultProps = Object.assign(
        {},
        BaseStaticPersonalisation.defaultProps,
        {
            name: "lgbtiqa-domestic-violence",
            heading: "Worried about your behaviour?",
            byline: "All of your answers are private and anonymous",
            showDoneButton: false,
            showBaseTextBox: true,
            baseTextBoxComponent: <DomesticViolenceLink/>,
        }
    );

    static summaryLabel = "Worried about your behaviour?";

    static showPage(): boolean {
        return DfvDemographics.answer &&
            DfvDemographics.answer.indexOf("LGBTIQA+") > -1;
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
                    <h4>
                        If you want to look at all services, go back and
                        de-select "LGBTIQA+"
                    </h4>
                </div>
            </div>
        );
    }
}


export default MobileDetect(LgbtiqaDomesticViolenceScreen);
