import React, {useId} from "react";
import type {ReactNode} from "react";

import SearchIcon from "@/src/icons/Search";
import Link from "@/src/components/base/Link";
import {
    getOtherServicesSuggestionPath,
    saveOtherServicesSuggestionAnswers,
} from "@/src/utils/other-services-suggestions"
import type {OtherServicesSuggestion} from "@/src/utils/other-services-suggestions"

type Props = {
    suggestions: Array<OtherServicesSuggestion>,
}

function OtherServicesPanel({suggestions}: Props): ReactNode {
    const headingId = useId()

    if (suggestions.length === 0) {
        return null
    }

    return (
        <div className="OtherServicesPanel">
            <p
                className="heading"
                id={headingId}
            >
                <SearchIcon aria-hidden="true" />
                People also searched for
            </p>
            <ul aria-labelledby={headingId}>
                {suggestions.map(({label, target}) => {
                    return (
                        <li key={label}>
                            <Link
                                to={getOtherServicesSuggestionPath(target)}
                                onClick={() =>
                                    saveOtherServicesSuggestionAnswers(target)
                                }
                                analyticsEvent={{
                                    event: "Link Followed - Other Services Suggestion",
                                    eventAction: "Other services suggestion",
                                    eventLabel: label,
                                }}
                            >
                                {label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default OtherServicesPanel
