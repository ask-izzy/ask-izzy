/* @flow */

import React from "react";
import _ from "underscore";

import fixtures from "../../fixtures/services";

class Eligibility extends React.Component {
    static propTypes = {
        catchment: React.PropTypes.string,
        eligibility_info: React.PropTypes.string,
        ineligibility_info: React.PropTypes.string,
    };

    static sampleProps = {default: fixtures.ixa};

    render(): ReactElement {
        let ineligibilityInfo: string = this.props.ineligibility_info;
        let eligibleMarkup, ineligibleMarkup;

        if (!_.isEmpty(this.props.eligibility_info) ||
            !_.isEmpty(this.props.special_requirements) ||
            !_.isEmpty(this.props.catchment)
        ) {
            eligibleMarkup = (
                <div className="eligibility">
                    <h3>To use this service you should be</h3>
                    <ul>
                        {this.renderCatchment()}
                        {this.renderEligibility(
                            this.props.eligibility_info
                        )}
                        {this.renderEligibility(
                            this.props.special_requirements
                        )}
                    </ul>
                </div>
            );
        }

        if (!_.isEmpty(ineligibilityInfo)) {
            ineligibleMarkup = (
                <div className="ineligibility">
                    <h3>You are ineligible if</h3>
                    <ul>
                        {this.renderEligibility(
                            this.props.ineligibility_info
                        )}
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
        let catchment: string = this.props.catchment;

        if (catchment) {
            return (
                <li>Located in {catchment}</li>
            );
        } else {
            return null;
        }
    }

    renderEligibility(eligibility: string): Array<ReactElement> {
        if (!_.isEmpty(eligibility)) {
            return eligibility.split("\n").map(
                (line, idx) => <li key={idx}>{line}</li>
            );
        }

        return [];
    }
}

export default Eligibility;
