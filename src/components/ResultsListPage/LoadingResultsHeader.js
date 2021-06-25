/* @flow */

import React from "react";
import Link from "../Link"

import HeaderBar from "../HeaderBar";
import type Category from "../../constants/Category";
import storage from "../../storage";
import routerContext from "../../contexts/router-context";
import {PersonalisationLink} from "../../pages/QuestionStepper.service";


const HomeLink = () =>
    <Link
        className="homeLink"
        to="/"
        onClick={storage.clear}
    >Go back</Link>;

const ErrorMessage = ({children}: Object) =>
    <p className="errorMessage">{children}</p>;

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
    location: {pathname: string},
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
            location,
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

        if (error) {
            const primaryText = (
                <LogoHeader>
                    Sorry, I couldn't do this search.
                </LogoHeader>
            )

            if (statusCode === 402) {
                return (
                    <HeaderBar
                        className="LoadingResultsHeader"
                        primaryText={primaryText}
                        secondaryText={
                            <div>
                                <ErrorMessage>{error}</ErrorMessage>
                                <HomeLink />
                                {" "}
                                <PersonalisationLink {...location} />
                            </div>
                        }
                        bannerName={bannerName}
                        alternateBackgroundColor={false}
                    />
                );
            }

            return (
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={primaryText}
                    secondaryText={
                        <div>
                            <ErrorMessage>{error}</ErrorMessage>
                            <HomeLink />
                        </div>
                    }
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
                            <h1 style={{
                                fontSize: "24pt",
                            }}
                            >
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
