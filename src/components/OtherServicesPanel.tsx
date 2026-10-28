import React, {useId} from "react";
import type {ReactNode} from "react";

import SearchIcon from "@/src/icons/Search";
import Link from "@/src/components/base/Link";
import {
    getOtherServicesSuggestionTarget,
    getOtherServicesSuggestionPath,
    saveOtherServicesSuggestionAnswers,
} from "@/src/utils/other-services-suggestions"

type Props = {
    suggestions: Array<string>,
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
                {suggestions.map(suggestion => {
                    const target = getOtherServicesSuggestionTarget(suggestion)
                    return (
                        <li key={suggestion}>
                            <Link
                                to={getOtherServicesSuggestionPath(target)}
                                onClick={() =>
                                    saveOtherServicesSuggestionAnswers(target)
                                }
                                analyticsEvent={{
                                    event: "Link Followed - Other Services Suggestion",
                                    eventAction: "Other services suggestion",
                                    eventLabel: suggestion,
                                }}
                            >
                                {suggestion}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default OtherServicesPanel
