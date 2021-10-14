/* @flow */

import React, {useState} from "react";
import type {Node as ReactNode} from "react";
import * as Diff from "diff";
import cnx from "classnames";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";

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

    const diff = Diff.diffJson(originalIssParams, issParams)

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
        <div className="diff">
            {diff.map((sentence, i) => (
                <div
                    className={cnx({
                        added: sentence.added,
                        removed: sentence.removed,
                    })}
                    key={i + sentence.value}
                >{
                        sentence.value.split(/\n/).map(line =>
                            <div
                                className="line"
                                key={i + line}
                            >{line}</div>
                        )
                    }</div>
            ))}
        </div>
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
