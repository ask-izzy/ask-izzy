/* @flow */

import * as React from "react";
import {Link} from "react-router-dom";

import HeaderBar from "../HeaderBar";
import type Category from "../../constants/Category";

import * as PersonalisationComponents from "../../pages/personalisation";
import storage from "../../storage";
import * as gtm from "../../google-tag-manager";
import routerContext from "../../contexts/router-context";
import _ from "lodash";

type Breadcrumb = {
    personalisations: Array<?string>,
    location: Object,
    count: number,
    title: string,
}

// Some modules that in the personalisation folder aren't really questions
// They need to be excluded from the answer breadcrumb
const PERSONALISATION_EXCLUSION_LIST = [
    "Intro",
    "OnlineSafetyScreenBundle",
    "OnlineSafetyScreen",
    "Under18DomesticViolenceScreen",
    "BaseQuestion",
    "BaseMultiQuestion",
]

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

const PersonalisationLink = ({pathname}: Object) => (
    <div className="edit">
        <Link
            to={`${trailingSlash(pathname)}personalise/summary`}
            onClick={gtm.emit.bind(null, {event: "changeAnswers"})}
        >
            Edit
        </Link>
    </div>
);

/**
 * The Answer breadcrumb component
 * @param personalisations - list of answers
 * @param title - Category title
 * @param location - edit answer url location
 * @param count - the result count
 * @returns {JSX.Element} - Returns the Answer breadcrumb with edit link
 */
const ResultBreadCrumb = (
    {personalisations, title, location, count}: Breadcrumb
): React.Node => (
    <div className="breadcrumb">
        {count > 0 ? "Showing Services for:"
            : `Sorry, I couldn't find any results for ${title}.`}
        {personalisations.length &&
            <span>
                {personalisations.join(" | ")}
            </span>
        }
        <PersonalisationLink {...location}/>
    </div>
)

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

        // Loops through all personalisations, filters out not
        // answered questions returns a list of answers.
        const personalisationList = _.differenceBy(
            Object.keys(PersonalisationComponents.default),
            PERSONALISATION_EXCLUSION_LIST,
        )

        const personalisations = personalisationList.reduce(
            (carry, component) => {
                if (this.props.personalisationComponents.includes(
                    PersonalisationComponents.default[component]
                ) && PersonalisationComponents.default[
                    component
                ].headingValue()) {
                    carry.push(PersonalisationComponents.default[
                        component
                    ].headingValue())
                }
                return carry
            }, [])


        return (
            <React.Fragment>
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={
                        <LogoHeader>
                            <ResultBreadCrumb
                                count={meta.total_count}
                                personalisations={personalisations}
                                location={location}
                                title={title.toLocaleLowerCase()}
                            />
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
