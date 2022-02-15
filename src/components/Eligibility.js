/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import _ from "underscore";
import _string from "underscore.string";

import UrlsToLinks from "./UrlsToLink"

type Props = {
    catchment: string,
    eligibility_info: string,
    ineligibility_info: string,
    referral_info: string,
    special_requirements: string,
}

class Eligibility extends React.Component<Props, void> {
    render(): ReactElement<"div"> {
        let eligibleMarkup, ineligibleMarkup;

        let eligibleItems = _.compact(_([
            this.renderCatchment(),
            this.renderEligibility(
                this.props.eligibility_info + "\n" +
                this.props.special_requirements
            ),
            this.renderReferralInfo(),
        ]).flatten());

        if (!_.isEmpty(eligibleItems)) {
            eligibleMarkup = (
                <div className="eligibility">
                    <h2 aria-label="Eligibility.">
                        Eligibility
                    </h2>
                    <ul>
                        {eligibleItems}
                    </ul>
                </div>
            );
        }

        let ineligibleItems = this.renderEligibility(
            this.props.ineligibility_info
        );

        if (!_.isEmpty(ineligibleItems)) {
            ineligibleMarkup = (
                <div className="ineligibility">
                    <h2 aria-label="Ineligibility.">
                        Ineligibility
                    </h2>
                    <ul>
                        {ineligibleItems}
                    </ul>
                </div>
            );
        }

        return (
            <div className="Eligibility">
                {eligibleMarkup}
                {ineligibleMarkup}
            </div>
        );
    }

    renderCatchment(): void | ReactElement<"li"> {
        const catchment: string = this.props.catchment;

        if (catchment && !catchment.match(/^open.?$/i)) {
            return this.renderItem(`Located in ${catchment}`);
        }
    }

    renderItem(text: string): void | ReactElement<"li"> {
        if (text) {
            return (<li key={text}><UrlsToLinks>{text}</UrlsToLinks></li>);
        }
    }

    renderEligibility(eligibility: ?string): any {
        const eligibilities = _.uniq(
            (eligibility || "")
                .split(/\n|;/g)
                .map((str) => _string.capitalize(str.trim()))
        );

        return _.compact(_(eligibilities).map(this.renderItem));
    }

    renderReferralInfo(): void | ReactElement<"li"> {
        const referralInfo = (this.props.referral_info || "").trim();

        if (referralInfo && !referralInfo.match(/^self\.?$/i)) {
            return this.renderItem(`Referred by ${referralInfo}`);
        }
    }
}

export default Eligibility;
