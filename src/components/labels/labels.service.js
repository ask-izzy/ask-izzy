/* @flow */

import BaseLabel from "./BaseLabel";
import FreeLowCostLabel from "./FreeLowCostLabel";
import BulkBilledLabel from "./BulkBilledLabel";
import HealthCareCardLabel from "./HealthCareCardLabel";
import {Service} from "../../iss";
import React from "react";

const LABEL_MAPPING = {
    "free_or_low_cost": {
        match: true,
        label: null,
    },
    "is_bulk_billing": {
        match: true,
        label: <BulkBilledLabel />,
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
    BulkBilledLabel,
    HealthCareCardLabel,
};

export const fetchLabels = (service: Service) => {
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
