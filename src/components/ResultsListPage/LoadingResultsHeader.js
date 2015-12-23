/* @flow */

import React from "react";
import {Link} from "react-router";

import LogoWithShadow from "../LogoWithShadow";
import HeaderBar from "../HeaderBar";

import Gender from "../../pages/personalisation/Gender";
import Age from "../../pages/personalisation/Age";
import Location from "../../pages/personalisation/Location";

const HomeLink = (): ReactElement =>
    <Link
        className="homeLink"
        to="/"
    >Go back</Link>;

const ErrorMessage = ({children}: Object): ReactElement =>
    <p className="errorMessage">{children}</p>;

const InfoMessage = (category: ?Object): ?ReactElement =>
    category && <div>{category.info}</div>;

const LogoHeader = ({children}: Object): ReactElement =>
    <div>
        <LogoWithShadow />
        {children}
    </div>;

const trailingSlash = (path: string): string =>
    `${path}${path.endsWith("/") ? "" : "/"}`;

const PersonalisationLink = ({pathname}: Object): ReactElement =>
    <Link
        className="change-personalisation"
        to={`${trailingSlash(pathname)}personalise/summary`}
    >
        Change your answers
    </Link>;

class LoadingResultsHeader extends React.Component {

    render(): ReactElement {
        const {
            error,
            statusCode,
            loading,
            category,
            location,
            title,
            meta,
        } = this.props;

        if (loading) {
            return (
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText="Searching..."
                    secondaryText={
                        <div>
                            <LogoWithShadow />
                            Loading results...
                        </div>
                    }
                />
            );
        }

        if (error) {
            const primaryText = (
                <LogoHeader>
                    Sorry, I couldn't do this search.
                </LogoHeader>
            )

            if (statusCode == 402) {
                return (
                    <HeaderBar
                        className="LoadingResultsHeader"
                        primaryText={primaryText}
                        secondaryText={
                            <div>
                                <ErrorMessage>{error}</ErrorMessage>
                                <HomeLink />
                                {' '}
                                <PersonalisationLink {...location} />
                            </div>
                        }
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
                />
            );
        }

        const servicesWord = meta.total_count == 1 ?
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
            <HeaderBar
                className="LoadingResultsHeader"
                primaryText={
                    meta.total_count > 0 ?
                        <LogoHeader>
                            I found {count} {servicesWord}{' '}
                            {personalisations.join(" ")}
                        </LogoHeader>
                    : <LogoHeader>
                         Sorry, I couldn't find any results
                         for {title.toLocaleLowerCase()}.
                     </LogoHeader>
                }
                secondaryText={
                    <div>
                        <InfoMessage {...category} />
                        <PersonalisationLink {...location} />
                    </div>
                }
            />
        );
    }

}

export default LoadingResultsHeader;
