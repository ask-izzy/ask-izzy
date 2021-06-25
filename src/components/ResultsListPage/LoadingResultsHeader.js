/* @flow */

import * as React from "react";

import HeaderBar from "../HeaderBar";
import type Category from "../../constants/Category";
import routerContext from "../../contexts/router-context";

const InfoMessage = (category: Object) =>
    <div>{category.info}</div>;

const LogoHeader = ({children}: Object) =>
    <div className="LogoHeader">
        {children}
    </div>;

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
    personalisationComponents: Array<Object>,
    error: string,
    statusCode: number,
    loading: boolean,
    category?: ?Category,
    title: string,
    meta: {total_count: number},
}

class LoadingResultsHeader extends React.Component<Props, void> {
    static contextType = routerContext;

    render() {
        const {
            error,
            statusCode,
            loading,
            category,
            title,
            meta,
        } = this.props;
        let bannerName = this.context.router.match?.params?.page || "homepage";

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
        const primaryText = category ? (
            <LogoHeader>
                <h1>
                    Sorry, we weren't able to find any
                    {" "}
                    services for this search.
                </h1>
            </LogoHeader>
        ) : (
            <LogoHeader>
                <h1>
                    Sorry, we weren't able to find any services
                    {" "}
                    matching your search for {title}.
                </h1>
            </LogoHeader>
        )

        if (error) {
            if (statusCode === 402) {
                return (
                    <HeaderBar
                        className="LoadingResultsHeader"
                        primaryText={primaryText}
                        bannerName={bannerName}
                        alternateBackgroundColor={false}
                    />
                );
            }

            return (
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={primaryText}
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
                        <LogoHeader>
                            <h1>
                                {meta.total_count > 0 ?
                                    formatResultsPageHeading(
                                        title.toLocaleLowerCase()
                                    )
                                    : `Sorry, I couldn't find any results` +
                                    ` for ${title.toLocaleLowerCase()}.`}
                            </h1>
                        </LogoHeader>
                    }
                    secondaryText={
                        <div>
                            {category && <InfoMessage {...category} />}
                        </div>
                    }
                    bannerName={bannerName}
                />
            </React.Fragment>
        );
    }
}

export default LoadingResultsHeader;
