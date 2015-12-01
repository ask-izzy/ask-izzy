/* @flow */

import React from "react";
import {Link} from "react-router";

import components from "../components";

const HomeLink = (): ReactElement =>
    <Link
        className="homeLink"
        to="home"
    >Go back</Link>;

const ErrorMessage = ({children}: Object): ReactElement =>
    <p className="errorMessage">{children}</p>;

const InfoMessage = (category: ?Object): ?ReactElement =>
    category && <div>{category.info}</div>;

const LogoHeader = ({children}: Object): ReactElement =>
    <div>
        <components.LogoWithShadow />
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

class ResultsListPage extends React.Component {

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
                <components.HeaderBar
                    primaryText={
                        <div>
                            <components.LogoWithShadow />
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
                    <components.HeaderBar
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
                <components.HeaderBar
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

        return (
            <components.HeaderBar
                primaryText={
                    meta.total_count > 0 ?
                        <LogoHeader>
                            I found these services for you
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

export default ResultsListPage;
