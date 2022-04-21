/* @flow */
import * as React from "react";

import icons from "../../../icons";
import Link from "../../../components/base/Link";

function Under18DomesticViolenceScreen(): React.Node {
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


export default Under18DomesticViolenceScreen;
