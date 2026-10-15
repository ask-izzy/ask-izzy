import React, {useState} from "react";
import type {ReactNode} from "react";
import {diffJson} from "diff";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import Diff from "./Diff"
import {SEARCH_RESULT_FIELDS} from "../../iss/Service"

type Props = {
    originalIssParams: { [key: string]: any },
    issParamsOverride: { [key: string]: any },
    setIssParamsOverride: (arg0?: { [key: string]: any }) => void
}
export default function IssParamsOverrideControls({
    originalIssParams,
    issParamsOverride,
    setIssParamsOverride,
}: Props): ReactNode {
    const [issParams, setIssParams] = useState(
        issParamsOverride
    )

    const cleanIssParams = (issParams) => {
        const cleanedIssParams = {
            // Make sure we always get the fields Izzy needs to display results
            fields: SEARCH_RESULT_FIELDS,
            ...issParams,
        }
        // Remove any empty values so they aren't sent to ISS
        for (const [key, value] of Object.entries(cleanedIssParams)) {
            if (
                value === "" ||
                value === null ||
                (Array.isArray(value) && value.length === 0)
            ) {
                delete cleanedIssParams[key]
            }
        }
        return cleanedIssParams
    }

    const diff = diffJson(originalIssParams, cleanIssParams(issParams))

    const stringArray = {
        type: "array",
        items: {
            type: "string",
        },
    }

    const schema = {
        type: "object",
        properties: {
            "search-terms": {
                type: "string",
                title: "Search terms",
            },
            "located-near": {
                type: "string",
                title: "Located near",
            },
            catchment: {
                type: "string",
            },
            "prefer-catchment": {
                type: "string",
                title: "Prefer catchment",
            },
            "service-type": {
                ...stringArray,
                title: "Service type",
            },
            "target-gender": {
                ...stringArray,
                title: "Target gender",
            },
            "age-group": {
                ...stringArray,
                title: "Age group",
            },
            "indigenous-classification": {
                ...stringArray,
                title: "Indigenous classification",
            },
            "is-cald-specific": {
                type: "boolean",
                title: "Is CALD specific",
            },
            name: {
                type: "string",
            },
            site: {
                type: "string",
                title: "Site ID",
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
            onChange={({ data }) => setIssParams(data)}
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
