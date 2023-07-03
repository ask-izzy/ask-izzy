/* @flow */

import React, {useState} from "react";
import type {Node as ReactNode} from "react";
import {diffJson} from "diff";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import Diff from "./Diff"

type Props = {
    originalIssParams: { [string]: any },
    issParamsOverride: { [string]: any },
    setIssParamsOverride: ({ [string]: any }) => void
}
export default function IssParamsOverrideControls({
    originalIssParams,
    issParamsOverride,
    setIssParamsOverride,
}: Props): ReactNode {
    const [issParams, setIssParams] = useState(
        issParamsOverride
    )

    const cleanIssParams = (issParams) => ({
        ...issParams,
        service_type_raw: issParams.service_type_raw?.length ? issParams.service_type_raw : undefined,
        location: issParams.location ? issParams.location : undefined,
        minimum_should_match: issParams.minimum_should_match ? issParams.minimum_should_match : undefined,
        type: issParams.type ? issParams.type : undefined,
        service_type: issParams.service_type?.length ? issParams.service_type : undefined,
        age_group: issParams.age_group?.length ? issParams.age_group : undefined,
        catchment: issParams.catchment ? issParams.catchment : undefined,
    })

    const diff = diffJson(originalIssParams, cleanIssParams(issParams))

    const schema = {
        type: "object",
        properties: {
            q: {
                type: "string",
                title: "Query String",
            },
            location: {
                type: "string",
            },
            area: {
                type: "string",
            },
            catchment: {
                type: "string",
                enum: ["prefer", "true", "false"],
            },
            client_gender: {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            age_group: {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            service_type: {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            service_type_raw: {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            show_in_askizzy_health: {
                type: "boolean",
            },
            minimum_should_match: {
                type: "string",
            },
            site_id: {
                type: "number",
                title: "Site ID (not used in Izzy search)",
            },
            type: {
                type: "string",
                title: "Type (not used in Izzy search)",
            },
            is_bulk_billing: {
                type: "boolean",
                title: "Is Bulk Billing (not used in Izzy search)",
            },
        },
    };
    return <div className="IssParamsOverrideControls">
        <JsonForms
            schema={schema}
            data={issParams}
            renderers={vanillaRenderers}
            cells={vanillaCells}
            validationMode={"NoValidation"}
            onChange={({ data, _errors }) => setIssParams(data)}
        />
        <Diff diff={diff} />
        <div>
            <button onClick={clearIssParamsOverride}>
                Clear Override
            </button>
            <button onClick={saveIssParamsOverride}>
                Save Override
            </button>
        </div>
    </div>

    function saveIssParamsOverride() {
        setIssParamsOverride(cleanIssParams(issParams))
    }

    function clearIssParamsOverride() {
        setIssParamsOverride()
    }
}
