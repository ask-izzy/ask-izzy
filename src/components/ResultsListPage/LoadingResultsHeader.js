/* @flow */

import React from "react";
import {Link} from "react-router-dom";

import HeaderBar from "../HeaderBar";
import type Category from "../../constants/Category";

import Gender from "../../pages/personalisation/Gender";
import Age from "../../pages/personalisation/Age";
import Location from "../../pages/personalisation/Location";
import storage from "../../storage";
import sendEvent from "../../google-tag-manager";
import routerContext from "../../contexts/router-context";

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
const trailingSlash = (path: string): string =>
    `${path}${path.endsWith("/") ? "" : "/"}`;

type Props = {
    disableEditAnswers?: boolean,
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
        const PersonalisationLink = this.PersonalisationLink

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

        const servicesWord = meta.total_count === 1 ?
            "service"
            : "services";
        const personalisations = [
            Gender,
            Age,
            Location,
        ].filter((component) =>
            this.props.personalisationComponents.includes(component)
        )
            .map((component) => component.headingValue())
        const count = meta.total_count > 20 ? "lots of" : meta.total_count;

        return (
            <React.Fragment>
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={
                        meta.total_count > 0 ?
                            <LogoHeader>
                                I found {count} {servicesWord}{" "}
                                {personalisations.join(" ")}
                            </LogoHeader>
                            : <LogoHeader>
                             Sorry, I couldn't find any results
                             for {title.toLocaleLowerCase()}.
                            </LogoHeader>
                    }
                    secondaryText={
                        <div>
                            {category && <InfoMessage {...category} />}
                        </div>
                    }
                    bannerName={bannerName}
                />
                <PersonalisationLink {...location} />
            </React.Fragment>
        );
    }

    PersonalisationLink = ({pathname}: Object) => {
        if (this.props.disableEditAnswers) {
            return <></>
        }
        return (
            <div className="change-personalisation-container">
                <Link
                    className="change-personalisation"
                    to={`${trailingSlash(pathname)}personalise/summary`}
                    onClick={sendEvent.bind(null, {event: "changeAnswers"})}
                >
                    Edit Answers
                </Link>
            </div>
        )
    };
}

export default LoadingResultsHeader;
