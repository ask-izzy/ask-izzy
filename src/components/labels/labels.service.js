/* @flow */

import BaseLabel from "./BaseLabel";
import FreeLowCostLabel from "./FreeLowCostLabel";
import HealthCareCardLabel from "./HealthCareCardLabel";
import React from "react";

const LABEL_MAPPING: Object = {
    "free_or_low_cost": {
        match: true,
        label: null,
    },
    "healthcare_card_holders": {
        match: true,
        label: <HealthCareCardLabel />,
    },
    "ndis_approved": {
        match: true,
        label: <BaseLabel labelText="NDIS Approved" />,
    },
    "statewide": {
        match: true,
        label: <BaseLabel labelText="State wide" />,
    },
    "parking_info": {
        match: "parking",
        label: null,
    },
}

export default {
    BaseLabel,
    FreeLowCostLabel,
    HealthCareCardLabel,
};

export const fetchLabels = (service: Object): Array<Object> => {
    const serviceKeys = Object.keys(service);
    const labels = [];
    for (let i = 0; i < serviceKeys.length; i++) {
        const label = LABEL_MAPPING[serviceKeys[i]];
        if (labels && serviceKeys[i] === "free_or_low_cost") {
            label.label =
                <BaseLabel
                    className="FreeLowCostLabel"
                    labelText="Free / Low Cost"
                    labelDescription={service.cost}
                />;
            labels.push(label);
        } else if (
            label && service[serviceKeys[i]] &&
            label?.match === "parking") {
            label.label =
                <BaseLabel
                    labelText="Parking"
                    labelDescription={service[serviceKeys[i]]}
                />;
            labels.push(label);
        } else if (label && service[serviceKeys[i]] === label?.match) {
            labels.push(label);
        }
    }
    return labels;
}
