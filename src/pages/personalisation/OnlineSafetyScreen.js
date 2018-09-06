/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import icons from "../../icons";
import AreYouSafe from "./AreYouSafe";

export default class OnlineSafetyScreen extends BaseStaticPersonalisation {
    static title = "Help";

    static defaultProps = {
        name: "online-safety-screen",
        heading: "Everyone has the right to feel safe",
        byline: "All of your answers are private and anonymous",
        showOnlineSafetyLink: true,
    };

    static showPage(): boolean {
        return Boolean(AreYouSafe.answer) && AreYouSafe.answer !== "Yes";
    }

    renderContent(): React.Element<any> {
        const link1800Respect = "/service/634190-1800respect";
        const number1800Respect = "1800 737 732";

        let isMobile;

        if (typeof window !== "undefined") {
            isMobile = window.innerWidth <= 768;
        } else {
            isMobile = false;
        }

        return (
            <div className="AreYouSafe">
                <div className="safety-message">
                    <icons.PhoneCalling className="PhoneIcon" />
                    <h2>
                        If you or someone else is in danger call{' '}
                        {
                            isMobile ? (
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
                            isMobile ? (
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
