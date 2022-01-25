/* @flow */

import * as React from "react";

import HeaderBar from "../HeaderBar";
import type Category from "../../constants/Category";
import routerContext from "../../contexts/router-context";
import {getBannerName} from "../../utils/personalisation"

const InfoMessage = (category: Object) =>
    <div>{category.info}</div>;

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
    category?: ?Category,
    title: string,
    services: Array<Service>,
}

class LoadingResultsHeader extends React.Component<Props, void> {
    static contextType: any = routerContext;

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
                    alternateBackgroundColor={false}
                />
            );
        }
        const primaryText = (category?: ?Category) => (
            category ? "Sorry, we weren't able to find any " +
                    "services for this search."
                : `Sorry, we weren't able to find any
                    services matching your search for ${title}.`
        )

        if (error) {
            console.log('error', error)
            if (statusCode === 402) {
                return (
                    <HeaderBar
                        className="LoadingResultsHeader"
                        primaryText={primaryText(category)}
                        bannerName={bannerName}
                        alternateBackgroundColor={false}
                    />
                );
            }

            return (
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={primaryText(category)}
                    bannerName={bannerName}
                    alternateBackgroundColor={false}
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
                    secondaryText={category?.info &&
                        <div>
                            <InfoMessage {...category} />
                        </div>
                    }
                    bannerName={bannerName}
                />
            </React.Fragment>
        );
    }
}

export default LoadingResultsHeader;
