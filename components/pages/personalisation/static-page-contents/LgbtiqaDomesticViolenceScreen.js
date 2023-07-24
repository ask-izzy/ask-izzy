/* @flow */
import * as React from "react";
import type {Node as ReactNode} from "react"
import icons from "@/src/icons";
import Link from "@/src/components/base/Link";
import Location from "@/src/constants/personalisation-pages/Location"
import {getSavedPersonalisationAnswer} from "@/src/utils/personalisation"

function LgbtiqaDomesticViolenceScreen(): ReactNode {
    function shouldShowVicService(): boolean {
        const location = getSavedPersonalisationAnswer(Location)
        if (typeof location === "string" && location.match(/, VIC$/)) {
            return true
        } else {
            return false
        }
    }

    function renderVictoriaService(): React.Element<any> {
        const linkService = "/service/4000053-with-respect";
        const phoneService = "1800 542 847";

        return (
            <p>
                If you're LGBTIQA+ and worried about any of your
                relationships,
                {" "}<Link to={linkService}>W|Respect</Link>{" "}
                can help. Call W|Respect on
                {" "}<Link to={`tel:${phoneService}`}>
                    {phoneService}
                </Link> for counselling and support.
            </p>
        );
    }

    function renderAustraliaWideService(): React.Element<any> {
        const linkService = "/service/1740955-qlife";
        const phoneService = "1800 184 527";
        const qLifeChat = "https://www.qlife.org.au/resources/chat";

        return (
            <p>
                If you're LGBTIQA+ and worried about any of your
                relationships,
                {" "}<Link to={linkService}>QLife</Link> can
                help. Call QLife on
                {" "}<Link to={`tel:${phoneService}`}>
                    {phoneService}
                </Link> or
                {" "}<Link to={qLifeChat}>chat online</Link> for
                counselling and support, 3pm – midnight every day.
            </p>
        );
    }

    const link1800Respect = "/service/634190-1800respect";
    const phone1800Respect = "1800 737 732";
    const chat1800Respect = "https://1800respect.org.au/help-and-support";
    const linkAcon = "http://www.anothercloset.com.au/";

    return (
        <div className="AreYouSafe">
            <div className="safety-message">
                <icons.PhoneTalk className="PhoneIcon" />
                <h2>
                    Everyone has the right to be safe and proud.<br />
                    Violence and abuse is never OK.
                </h2>
                {shouldShowVicService() ? renderVictoriaService()
                    : renderAustraliaWideService()}
                <p>
                    Get information about
                    {" "}<Link to={linkAcon}>
                        domestic and family violence in
                        LGBTIQA+ relationships.
                    </Link>
                </p>
                <h3>
                    You can also get 24-hour help from non-LGBTIQA+
                    specific services
                </h3>
                <p>
                    Mainstream services like
                    {" "}<Link to={link1800Respect}>1800RESPECT</Link>
                    {" "}can also help if you are worried about unhealthy,
                    abusive or violent behaviour in any of your
                    relationships. Contact 1800RESPECT on
                    {" "}<Link to={`tel:${phone1800Respect}`}>
                        1800 737 732
                    </Link> or through their
                    {" "}<Link to={chat1800Respect}>online chat.</Link>
                </p>
            </div>
        </div>
    );
}


export default LgbtiqaDomesticViolenceScreen;
