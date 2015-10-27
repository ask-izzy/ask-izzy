/* @flow */

import React from "react";

import fixtures from "../../fixtures/services";

class Eligibility extends React.Component {
    static propTypes = {
        catchment: React.PropTypes.string,
        eligibility_info: React.PropTypes.string,
        ineligibility_info: React.PropTypes.string,
    };

    static sampleProps = {default: fixtures.ixa};

    eligibility(eligibility: string): Array<ReactElement> {
        if (eligibility) {
            return eligibility.split("\n").map(
                (line, idx) => <li key={idx}>{line}</li>
            );
        }

        return [];
    }

    render(): ReactElement {
        let catchment: string = this.props.catchment || "";
        let eligibilityInfo: string = this.props.eligibility_info || "";
        let ineligibilityInfo: string = this.props.ineligibility_info || "";
        let eligibleMarkup, ineligibleMarkup;

        if (eligibilityInfo.length || catchment.length) {
            eligibleMarkup = (
                <div className="eligibility">
                    <h3>To use this service you should be</h3>
                    <ul>
                        <li>Located in {catchment}</li>
                        {this.eligibility(eligibilityInfo)}
                    </ul>
                </div>
            );
        }

        if (ineligibilityInfo.length) {
            ineligibleMarkup = (
                <div className="ineligibility">
                    <h3>You are ineligible if</h3>
                    <ul>
                        {this.eligibility(ineligibilityInfo)}
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
}

export default Eligibility;
