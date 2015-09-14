/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";

class Eligibility extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa};

    eligibility(eligibility:string): Array<React.Element> {
        if (eligibility) {
            return eligibility.split("\n").map(
                (line, idx) => <li key={idx}>{line}</li>
            );
        }

        return [];
    }

    render(): React.Element {
        var catchment = this.props.catchment;
        var eligibilityInfo = this.props.eligibility_info;
        var ineligibilityInfo = this.props.ineligibility_info;
        var eligibleMarkup;
        var ineligibleMarkup;

        if (eligibilityInfo || catchment) {
            eligibleMarkup = (
                <div className="eligibility">
                    <h3>To use this service</h3>
                    <ul>
                        <li>Located in { catchment}</li>
                        { this.eligibility(eligibilityInfo) }
                    </ul>
                </div>
            );
        }

        if (ineligibilityInfo) {
            ineligibleMarkup = (
                <div className="ineligibility">
                    <h3>You are ineligible if:</h3>
                    <ul>
                        { this.eligibility(ineligibilityInfo) }
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
