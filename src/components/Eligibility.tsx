import React, {ReactNode} from "react"
import _ from "underscore"
import _string from "underscore.string"

import UrlsToLinks from "@/src/components/UrlsToLink.js"

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
}: Props) {
    let eligibleMarkup, ineligibleMarkup

    const eligibleItems = _.compact(_([
        renderCatchment(),
        renderEligibility(
            eligibilityInfo + "\n" +
            specialRequirements,
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

    const ineligibleItems = renderEligibility(
        ineligibilityInfo,
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
            return renderItem(`Located in ${catchment}`)
        }
    }

    function renderItem(text: string): void | ReactNode {
        if (text) {
            return (
                <li key={text}>
                    <UrlsToLinks key={text}>{text}</UrlsToLinks>
                </li>
            )
        }
    }

    function renderEligibility(eligibility: string | null | undefined): any {
        const eligibilities = _.uniq(
            (eligibility || "")
                .split(/\n|;/g)
                .map((str) => _string.capitalize(str.trim())),
        )
        return _.compact(_(eligibilities).map(renderItem))
    }

    function renderReferralInfo(): void | ReactNode {
        const referral = (referralInfo || "").trim()

        if (referral && !referral.match(/^self\.?$/i)) {
            return renderItem(`Referred by ${referral}`)
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
