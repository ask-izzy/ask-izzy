import React, {useId} from "react";
import type {ReactNode} from "react";

import SearchIcon from "@/src/icons/Search";
import Link from "@/src/components/base/Link";
import {
    getOtherServicesSuggestionPath,
    quoteSearchText,
    saveOtherServicesSuggestionAnswers,
} from "@/src/utils/other-services-suggestions"
import type {OtherServicesSuggestion} from "@/types/other-services-suggestion"

type Props = {
    suggestions: Array<OtherServicesSuggestion>,
    // Show placeholder chips while suggestions may still arrive
    isLoading?: boolean,
}

// Widths of the placeholder chips, roughly those of typical labels
const SKELETON_CHIP_WIDTHS = ["9em", "6em", "11em", "7.5em"]

function OtherServicesPanel({suggestions, isLoading}: Props): ReactNode {
    const headingId = useId()

    if (isLoading) {
        return (
            <div className="OtherServicesPanel">
                <p className="heading">
                    <SearchIcon aria-hidden="true" />
                    People also searched for
                </p>
                <ul
                    aria-busy="true"
                    aria-label="Loading suggestions"
                >
                    {SKELETON_CHIP_WIDTHS.map(width => (
                        <li key={width}>
                            {/* A space gives it the height of a line
                                of text, the same as a chip */}
                            <span
                                className="skeletonChip"
                                style={{width}}
                                aria-hidden="true"
                            >
                                {"\u00a0"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

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
                                {target.type === "search" ?
                                    quoteSearchText(label)
                                    : label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default OtherServicesPanel
