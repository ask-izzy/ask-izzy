/* @flow */
import * as React from "react";
import {useRouter} from "next/router"

import PhoneButton from "./PhoneButton";
import StrapiMarkdown from "./StrapiMarkdown";
import Link from "./base/Link";
import * as gtm from "../google-tag-manager";
import type {CmsCalloutBoxFragmentType} from "@/queries/content/callout";

type Props = {
    calloutBoxes: Array<CmsCalloutBoxFragmentType>,
}

/**
 * The Callout Box component
 *
 * @param calloutBoxes - A list of Callout boxes from the CMS
 * @returns {null|*} - returns the callout box or null
 * @constructor
 */
function CalloutBox({calloutBoxes}: Props): React.Node | null {
    const router = useRouter();

    function getAnalyticsEvent(callout: CmsCalloutBoxFragmentType) {
        return {
            event: `Link Followed - Callout`,
            eventCat: "Link followed",
            eventAction: "Callout",
            eventLabel: callout.attributes?.Heading || null,
            sendDirectlyToGA: true,
        }
    }

    const onClickBox = (callout: CmsCalloutBoxFragmentType): void => {
        const path = callout.attributes?.Link
        if (!path) {
            return;
        }

        gtm.emit(getAnalyticsEvent(callout))

        // if the path is local (as defined by prefixed slash)
        // go to the internal link, else open it externally
        if (path.charAt(0) === "/") {
            router.push(path);
        } else {
            window.location = path;
        }

    }

    /**
     * The callout box JSX
     *
     * @param callout - The callout details
     * @returns {JSX.Element} - The Component
     * @constructor
     */
    const Box = ({callout}: {callout: CmsCalloutBoxFragmentType}): React.Node => {
        const style = {
            cursor: "pointer",
            ...(callout.attributes?.Style || {}),
        }
        const className = "CalloutBox " + (
            callout.attributes?.StyleClass?.data?.attributes?.className || "askIzzyInfoBox"
        )
        return (
            <div
                onClick={callout?.attributes?.Link ? () => onClickBox(callout) : null}
                style={style}
                className={className}
            >
                {callout.attributes?.ShowHeading && <h2>{callout.attributes?.Heading}</h2>}
                <StrapiMarkdown
                    renderers={{
                        link: ({href, children}) =>
                            <Link
                                to={href}
                                children={children}
                                analyticsEvent={getAnalyticsEvent(callout)}
                            />,
                    }}
                >
                    {callout.attributes?.Body || ""}
                </StrapiMarkdown>
                {callout.attributes?.Phone &&
                    <PhoneButton
                        number={callout.attributes?.Phone || ""}
                        comment=""
                        kind=""
                        crisis={true}
                    />}
            </div>
        )
    }

    return calloutBoxes.map((callout: CmsCalloutBoxFragmentType, index: number) => {
        return (
            <Box
                callout={callout}
                key={`${String(callout.id)}_${index}`}
            />
        )
    })
}

export default CalloutBox
