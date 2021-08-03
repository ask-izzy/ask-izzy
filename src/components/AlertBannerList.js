/* @flow */
import * as React from "react";
import { useQuery } from "@apollo/client";
import classnames from "classnames";

import AlertBanner from "./AlertBanner";
import StrapiMarkdown from "./StrapiMarkdown";
import Link from "./base/Link";
import alertsQuery from "../queries/content/alerts.js";
import ScreenReader from "./ScreenReader";

type Props = {
    screenLocation: string,
    state?: string,
    format?: string
}

export default function({state, screenLocation, format}: Props): React.Node {
    const { loading, error, data } = useQuery(alertsQuery, {
        variables: {
            state,
            screenLocation,
        },
    });

    if (loading) {
        return null;
    }
    if (error) {
        console.warn("An error occurred when trying to fetch alerts:", error)
        return null
    }

    const alertLevelMap = {
        info: 1,
        warn: 2,
    }

    const alerts = data.alerts.map(
        alert => ({...alert, "created_at": new Date(alert.created_at)})
    ).sort(
        (a, b) =>
            // more urgent first
            alertLevelMap[b.alertLevel] - alertLevelMap[a.alertLevel] ||
            // state based alerts over national
            (b.states.length && 1) - (a.states.length && 1) ||
            // newer first
            b.created_at - a.created_at
    )

    return (
        alerts.length ? (
            <div
                className={classnames(
                    "AlertBannerList",
                    format
                )}
                role="region"
                aria-labelledby="alerts"
            >
                <ScreenReader>
                    <span id="alerts">
                        Alerts.
                    </span>
                </ScreenReader>
                <ul>
                    {alerts.map(renderAlert)}
                </ul>
            </div>
        ) : null
    )

    function renderAlert({id, title, body, alertLevel, defaultToOpen}) {
        return <li key={id}>
            <AlertBanner
                title={renderContent(title, id)}
                body={renderContent(body, id)}
                alertLevel={alertLevel}
                defaultToOpen={defaultToOpen}
            />
        </li>
    }

    function renderContent(content: string, id: number) {
        if (!content || !content.trim()) {
            return null
        }
        return (
            <StrapiMarkdown
                renderers={{
                    link: ({href, children}) =>
                        <Link
                            to={href}
                            children={children}
                            analyticsEvent={{
                                event: `Link Followed - Alert`,
                                eventAction: "Alert",
                                eventLabel: `Alert ${id} - ${href}`,
                            }}
                        />,
                }}
            >
                {content}
            </StrapiMarkdown>
        )
    }
}
