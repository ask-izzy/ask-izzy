/* @flow */
import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import classnames from "classnames";

import AlertBanner from "./AlertBanner";
import Cross from "../icons/Cross"
import StrapiMarkdown from "./StrapiMarkdown";
import Link from "./base/Link";
import Info from "./../icons/Info";
import Button from "./base/Button";
import alertsQuery from "@/queries/content/alerts.js";
import storage from "../storage";

type Props = {
    screenLocation: string,
    state?: string,
    format?: string
}

function AlertBannerList({
    state,
    screenLocation,
    format,
}: Props): React.Node {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

    const { loading, error, data } = useQuery(alertsQuery, {
        variables: {
            state,
            screenLocation,
        },
    });
    useEffect(checkCollapsedStatus, [data])

    if (loading) {
        return null;
    }
    if (error) {
        console.warn("An error occurred when trying to fetch alerts:", error)
        return null
    }

    //organize alerts
    const alertLevelMap = {
        info: 1,
        warn: 2,
    }
    let containsWarnings = false
    let alertStorageObj = {}
    const alerts = data.alerts.map(
        (alert) => {
            //check for warnings
            if (alert.alertLevel === "warn") {
                containsWarnings = true
            }
            //arrange obj for storage
            alertStorageObj[alert.id] = alert.updated_at
            return ({
                ...alert,
                "created_at": new Date(alert.created_at),
                "updated_at": new Date(alert.updated_at),
            })
        }
    ).sort(
        (a, b) =>
            // more urgent first
            alertLevelMap[b.alertLevel] - alertLevelMap[a.alertLevel] ||
            // state based alerts over national
            (b.states.length && 1) - (a.states.length && 1) ||
            // newer first
            b.updated_at - a.updated_at
    )

    function checkCollapsedStatus() {
        const previousAlerts = storage.getJSON("previous-Alerts")
        let hasNewAlerts = false

        for (let alert in alertStorageObj) {
            if (
                !previousAlerts ||
                !(alert in previousAlerts) ||
                alertStorageObj[alert].updated_at !== previousAlerts[alert].updated_at
            ) {
                hasNewAlerts = true
            }
        }
        setIsCollapsed(!(containsWarnings && hasNewAlerts))
        if (alertStorageObj) {
            storage.setJSON(
                "previous-Alerts", {...previousAlerts, ...alertStorageObj}
            )
        }
    }

    function onCollapseButtonClick(
        event: SyntheticEvent<HTMLButtonElement>
    ) {
        setIsCollapsed(!isCollapsed)

    }

    return (
        alerts.length ? (
            <div
                className={classnames(
                    "AlertBannerList",
                    format
                )}
            >
                {
                    isCollapsed &&
                    <Button
                        alt="Alert List"
                        className="AlertBannerButton"
                        onClick={onCollapseButtonClick}
                    >
                        <div className="AlertBannerContent">
                            <Info/>
                            {alerts.length}
                        </div>
                    </Button>
                }
                {
                    !isCollapsed &&
                    <div className="alert-container">
                        <ul aria-label="Alerts">
                            {renderAlertListTitle()}
                            {alerts.map(renderAlert)}
                        </ul>
                    </div>
                }
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
                analyticsEvent={{
                    eventLabel: id,
                }}
            />
        </li>
    }

    function renderAlertListTitle() {
        return (
            <li className="AlertListTitleContainer">
                <span className="AlertListTitle">
                    <Info />
                    <span className="text">
                        {
                            `${alerts.length} Notification${
                                alerts.length > 1 ?
                                    "s" : ""
                            }`
                        }
                    </span>

                </span>
                {
                    <Button
                        className="DismissAlertList"
                        alt="Dismiss Alert List"
                        onClick={onCollapseButtonClick}
                    >
                        <Cross />
                    </Button>
                }
            </li>
        )
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

export default AlertBannerList
