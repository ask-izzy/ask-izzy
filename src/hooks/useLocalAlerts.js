/* @flow */
/*
Allows components to include their own alerts in the site wide alert system.
*/

import { useEffect, useState } from "react";
import type { Alert } from "@/src/components/AlertBannerList";

let localAlerts: Alert[] = [];

const localAlertsListeners = new Set<(alerts: Alert[]) => void>();

function setLocalAlerts(newAlerts: Alert[]) {
    localAlerts = newAlerts;
    localAlertsListeners.forEach(listener => listener(localAlerts));
}

type UseLocalAlertsResult = {
    localAlerts: Alert[],
    addAlert: (alert: Alert) => void,
    removeAlert: (documentId: string) => void,
};

export function useLocalAlerts(): UseLocalAlertsResult {
    // Use useState just to trigger a re-render when localAlerts changes.
    const [, rerender] = useState();
    useEffect(() => {
        localAlertsListeners.add(rerender);
        return () => {
            // cleanup on unmount
            localAlertsListeners.delete(rerender);
        }
    }, []);

    function addAlert(alert: Alert) {
        setLocalAlerts([...localAlerts, alert]);
    }

    function removeAlert(documentId: string) {
        setLocalAlerts(localAlerts.filter(a => a.documentId !== documentId));
    }

    return {
        localAlerts,
        addAlert,
        removeAlert,
    };
}
