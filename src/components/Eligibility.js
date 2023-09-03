/* @flow */

import type {Node as ReactNode} from "React"
import React from "react"
import _ from "underscore"
import _string from "underscore.string"

import FormatText from "./FormatText"

type Props = {
    catchment: string,
    eligibility_info: string,
    ineligibility_info: string,
    referral_info: string,
    special_requirements: string,
}


function Eligibility({
    catchment,
    eligibility_info: eligibilityInfo,
    ineligibility_info: ineligibilityInfo,
    referral_info: referralInfo,
    special_requirements: specialRequirements,
}: Props): ReactNode {
    let eligibleMarkup, ineligibleMarkup

    let eligibleItems = _.compact(_([
        renderCatchment(),
        renderEligibility(
            eligibilityInfo + "\n" +
            specialRequirements
        ),
        renderReferralInfo(),
    ]).flatten())

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
        )
    }

    let ineligibleItems = renderEligibility(
        ineligibilityInfo
    )

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
        )
    }

    function renderCatchment(): void | ReactNode {
        if (catchment && !catchment.match(/^open.?$/i)) {
            return renderList([`Located in ${catchment}`])
        }
    }

    function renderList(listItems: string[]): ReactNode | void {
        if (listItems.length) {
            return (
                <FormatText
                    key={JSON.stringify(listItems)}
                    paragraphWrapperElement="li"
                >
                    {listItems}
                </FormatText>
            )
        } else {
            return
        }
    }

    function renderEligibility(eligibility: ?string): ReactNode | void {
        const eligibilities = _.uniq(
            (eligibility || "")
                .split(/\n|;/g)
                .map((str) => _string.capitalize(str.trim()))
                .filter(text => text)
        )
        return renderList(eligibilities)
    }

    function renderReferralInfo(): void | ReactNode {
        const referral = (referralInfo || "").trim()

        if (referral && !referral.match(/^self\.?$/i)) {
            return renderList([`Referred by ${referral}`])
        }
    }

    return (
        <div className="Eligibility">
            {eligibleMarkup}
            {ineligibleMarkup}
        </div>
    )
}

export default Eligibility
