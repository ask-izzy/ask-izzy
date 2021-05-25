/* @flow */
import * as React from "react";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@apollo/client";
import classnames from "classnames";

import AlertBanner from "./AlertBanner";
import alertsQuery from "../queries/content/alerts.js";

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
        <div className={classnames(
            "AlertBannerList",
            format
        )}
        >
            <ul>
                {alerts.map(renderAlert)}
            </ul>
        </div>
    )

    function renderAlert({id, title, body, alertLevel}) {
        return <li key={id}>
            <AlertBanner
                title={renderContent(title)}
                body={renderContent(body)}
                alertLevel={alertLevel}
            />
        </li>
    }

    function renderContent(content: string) {
        if (!content || !content.trim()) {
            return null
        }
        return (
            <ReactMarkdown
                plugins={[gfm]}
                source={content}
            />
        )
    }
}
