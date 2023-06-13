import React, {useState} from "react";
import {diffJson} from "diff";
import {JsonForms} from "@jsonforms/react";
import {vanillaCells, vanillaRenderers} from "@jsonforms/vanilla-renderers";

import Diff from "@/src/components/debug/Diff"

type Props = {
    originalIssParams: Record<string, any>,
    issParamsOverride: Record<string, any>,
    setIssParamsOverride: (issParams?: Record<string, any>) => void
}
export default function IssParamsOverrideControls({
    originalIssParams,
    issParamsOverride,
    setIssParamsOverride,
}: Props) {
    const [issParams, setIssParams] = useState(
        issParamsOverride,
    )

    const diff = diffJson(originalIssParams, issParams)

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
            onChange={({data}) => setIssParams(data)}
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
        setIssParamsOverride(issParams)
    }

    function clearIssParamsOverride() {
        setIssParamsOverride()
    }
}
