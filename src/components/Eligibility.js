/* @flow */

import React from "react";
import _ from "underscore";
import _string from "underscore.string";

import fixtures from "../../fixtures/services";

class Eligibility extends React.Component {
    props: Object;
    state: Object;
    static propTypes = {
        catchment: React.PropTypes.string,
        eligibility_info: React.PropTypes.string,
        ineligibility_info: React.PropTypes.string,
        referral_info: React.PropTypes.string,
    };

    static sampleProps = {default: fixtures.ixa};

    render() {
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
                    <h3>To use this service you should be</h3>
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
                    <h3>You are ineligible if</h3>
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

    renderCatchment(): ?ReactElement {
        const catchment: string = this.props.catchment;

        if (catchment && !catchment.match(/^open.?$/i)) {
            return this.renderItem(`Located in ${catchment}`);
        }
    }

    renderItem(text: string): ?ReactElement {
        if (text) {
            return (<li key={text}>{text}</li>);
        }
    }

    renderEligibility(eligibility: ?string): Array<?ReactElement> {
        const eligibilities = _.uniq(
            (eligibility || "")
                .split(/\n|;/g)
                .map((str) => _string.capitalize(str.trim()))
        );

        return _.compact(_(eligibilities).map(this.renderItem));
    }

    renderReferralInfo(): ?ReactElement {
        const referralInfo = (this.props.referral_info || "").trim();

        if (referralInfo && !referralInfo.match(/^self\.?$/i)) {
            return this.renderItem(`Referred by ${referralInfo}`);
        }
    }
}

export default Eligibility;
