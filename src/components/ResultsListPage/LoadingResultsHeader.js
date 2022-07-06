/* @flow */

import * as React from "react";

import HeaderBar from "../HeaderBar";
import type Category from "../../constants/Category";
import {getBannerName} from "../../utils/personalisation"
import type Service from "../../iss/Service"

const formatResultsPageHeading = (title: string) => {
    switch (title) {
    case "finding work":
        return "Showing services to help";
    case "facilities":
        return "Showing places and services with bathrooms";
    case "something to do":
        return "Showing community and leisure services";
    case "technology":
        return "Showing places to connect to the internet";
    case "centrelink":
        return "Showing Centrelink sites";
    case "everyday things":
        return "Showing services that provide everyday things";
    default:
        return `Showing ${title} services`;
    }
}


type Props = {
    error: string,
    statusCode: number,
    loading: boolean,
    category: Category,
    title: string,
    services: Array<Service>,
}

class LoadingResultsHeader extends React.Component<Props, void> {
    render(): React.Node {
        const {
            error,
            statusCode,
            loading,
            category,
            title,
            services,
        } = this.props;
        const bannerName = getBannerName(
            this.props.category
        );

        if (loading) {
            return (
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText="Searching..."
                    secondaryText={
                        <div>
                            Loading results...
                        </div>
                    }
                    bannerName={bannerName}
                />
            );
        }
        const primaryText = (category: Category) => (
            category.key !== "search" ?
                "Sorry, we weren't able to find any " +
                    "services for this search."
                : `Sorry, we weren't able to find any
                    services matching your search for ${title}.`
        )

        if (error) {
            if (statusCode === 402) {
                return (
                    <HeaderBar
                        className="LoadingResultsHeader"
                        primaryText={primaryText(category)}
                        bannerName={bannerName}
                    />
                );
            }

            return (
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={primaryText(category)}
                    bannerName={bannerName}
                />
            );
        }

        return (
            <React.Fragment>
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={
                        services.length > 0 ?
                            formatResultsPageHeading(
                                title.toLocaleLowerCase()
                            )
                            : primaryText(category)
                    }
                    bannerName={bannerName}
                />
            </React.Fragment>
        );
    }
}

export default LoadingResultsHeader;
