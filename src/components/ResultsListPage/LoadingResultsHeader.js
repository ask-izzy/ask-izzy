/* @flow */

import React from "react";
import type { Node as ReactNode } from "React";
import HeaderBar from "../HeaderBar";
import Category from "@/src/constants/Category";
import { getBannerName } from "../../utils/personalisation";
import type Service from "../../iss/Service";

const formatResultsPageHeading = (title: string) => {
    const headings = {
        "finding work": "Showing services to help",
        "facilities": "Showing places and services with bathrooms",
        "something to do": "Showing community and leisure services",
        "technology": "Showing places to connect to the internet",
        "centrelink": "Showing Centrelink sites",
        "everyday needs": "Showing services that provide everyday needs",
    };

    return headings[title] || `Showing ${title} services`;
};

type Props = {
    error: string,
    statusCode: number,
    loading: boolean,
    category: Category,
    title: string,
    services: Array<Service>,
};

function LoadingResultsHeader({
    error,
    statusCode,
    loading,
    category,
    title,
    services,
}: Props): ReactNode {
    const bannerName = getBannerName(category);

    if (loading) {
        return (
            <HeaderBar
                className="LoadingResultsHeader"
                primaryText="Searching..."
                secondaryText="Loading results..."
                bannerName={bannerName}
            />
        );
    }

    const primaryText = `Sorry, we weren't able to find any ${
        category.key !== "search" ?
            "services for this search."
            : `services matching your search for ${title}.`
    }`;

    if (error || statusCode === 402) {
        return (
            <HeaderBar
                className="LoadingResultsHeader"
                primaryText={primaryText}
                bannerName={bannerName}
            />
        );
    }

    return (
        <HeaderBar
            className="LoadingResultsHeader"
            primaryText={
                services.length > 0 ?
                    formatResultsPageHeading(title.toLocaleLowerCase())
                    : primaryText
            }
            bannerName={bannerName}
        />
    );
}

export default LoadingResultsHeader;
