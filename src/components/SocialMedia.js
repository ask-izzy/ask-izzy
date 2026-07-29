/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Link from "./base/Link";
import type {AnalyticsEvent} from "../google-tag-manager";
import ScreenReader from "./ScreenReader";

type Props = {
    type: string,
    url: string,
    analyticsEventDetails?: AnalyticsEvent
}

function SocialMedia({
    type,
    url,
    analyticsEventDetails,
}: Props): ReactNode {
    const getFormattedType = () => {
        const typeMap = {
            youtube: "YouTube",
            linkedin: "LinkedIn",
            instagram: "Instagram",
            twitter: "Twitter / X",
            facebook: "Facebook",
        };
        return typeMap[type.toLowerCase()] || type;
    };

    const getIcon = () => {
        switch (type.toLowerCase()) {
        case "instagram":
            return <InstagramIcon aria-hidden={true} /> ;
        case "facebook":
            return <FacebookIcon aria-hidden={true} />;
        case "twitter":
            return <XIcon aria-hidden={true} />;
        case "linkedin":
            return <LinkedInIcon aria-hidden={true} />;
        case "youtube":
            return <YouTubeIcon aria-hidden={true} />;
        default:
            return null;
        }
    };

    return (
        <div className="Contact SocialMedia">
            <ScreenReader>
                {getFormattedType()} link:
            </ScreenReader>
            <Link
                to={url}
                target="_blank"
                aria-label="Opens in a new tab"
                analyticsEvent={{
                    event: `Link Followed - ${getFormattedType()} Social Media`,
                    eventAction: `Contact detail - ${type.toLowerCase()}`,
                    eventLabel: url,
                    ...analyticsEventDetails,
                }}
            >
                {getIcon()}
                <div className="Contact-text">
                    <span className="web value">
                        {getFormattedType()}
                    </span>
                </div>
                <OpenInNewIcon
                    aria-hidden={true}
                    className="Contact-icon-end"
                />
            </Link>
        </div>
    )
}

export default SocialMedia
