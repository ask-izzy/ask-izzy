/* @flow */

import type {
    Node as ReactNode,
} from "React";
import React, {useState} from "react";
import {diffJson} from "diff";
import { useRouter } from "next/router"
import {
    getSearchQueryModifiers,
    buildSearchQueryFromModifiers,
} from "../iss/searchQueryBuilder"
import type {SearchQueryModifier, SearchQuery} from "../iss/searchQueryBuilder"
import {convertIzzySearchQueryToIss3} from "../iss/serviceSearch"
import Button from "./base/Button"
import Diff from "./debug/Diff"
import type { DiffType } from "./debug/Diff"
import DebugContainer from "../components/DebugContainer";
import IssParamsOverrideControls from
"../components/debug/IssParamsOverrideControls";
import Storage from "../storage";

type Props = {|
    issQuery: SearchQuery,
    setIssParamsOverride: (
        issParamsOverride?: { [string]: any },
        triggerNewSearch?: boolean
    ) => void
|}

type DiffedLayer = {
    name: string,
    diff: DiffType | null
}

function DebugPersonalisation({
    issQuery,
    setIssParamsOverride,
}: Props): ReactNode {
    if (typeof window === "undefined") {
        return null
    }
    const [convertToISSQuery, setConvertToISSQuery] = useState(true)
    const router = useRouter()

    // Cast because flow is stupid and doesn't know we're filtering out null
    // https://github.com/facebook/flow/issues/5955
    const searchQueryModifiers: SearchQueryModifier[] = (
        getSearchQueryModifiers(
            router
        ).filter(layer => layer): any
    )

    const originalIssQuery = convertIzzySearchQueryToIss3(
        issQuery
    )

    const diffedLayers: DiffedLayer[] =
        getDiffedLayers(searchQueryModifiers, convertToISSQuery)

    return (
        <DebugContainer
            message="Debug ISS Query"
            externalCollapsed={
                !!Storage.getJSON("issParamsOverride")
            }
        >
            <div className="DebugPersonalisation">
                {diffedLayers.map((layer, index) => (
                    <div key={layer.name + index}>
                        <div key={layer.name + index}>
                            <div className="layerHeading">
                                <h5>Layer {index + 1}: {layer.name}</h5>
                                {layer.diff === null && " - No changes"}
                            </div>

                            {layer.diff && <Diff diff={layer.diff} />}
                        </div>
                    </div>
                ))}
            </div>
            {Storage.getJSON("issParamsOverride") ?
                <IssParamsOverrideControls
                    originalIssParams={originalIssQuery}
                    issParamsOverride={
                        Storage.getJSON("issParamsOverride")
                    }
                    setIssParamsOverride={
                        setIssParamsOverride
                    }
                />
                : <>
                    <Button
                        onClick={() => setConvertToISSQuery(!convertToISSQuery)}
                    >
                        {convertToISSQuery ?
                            "Display query in Izzy specific format"
                            : "Display query in the format " +
                                "that it is sent to ISS"
                        }
                    </Button>
                    {" "}
                    {convertToISSQuery && (
                        <Button
                            onClick={() => setIssParamsOverride(
                                originalIssQuery,
                                true
                            )}
                        >
                            Override ISS Query
                        </Button>
                    )}
                </>
            }
        </DebugContainer>
    );
}

function getDiffedLayers(
    searchQueryModifiers,
    convertToISSQuery
): DiffedLayer[] {
    const formattedLayers = convertToISSQuery ?
        searchQueryModifiers.map(layer => ({
            ...layer,

        }))
        : searchQueryModifiers
    const diffedLayers: DiffedLayer[] = []
    for (let i = 0; i < formattedLayers.length; i++) {
        let mergedUpToPreviousLayer = buildSearchQueryFromModifiers(
            formattedLayers.slice(0, i || 1)
        )
        let mergedUpToIncludingLayer = buildSearchQueryFromModifiers(
            formattedLayers.slice(0, i + 1)
        )


        if (convertToISSQuery) {
            mergedUpToPreviousLayer = convertIzzySearchQueryToIss3(
                mergedUpToPreviousLayer
            )
            mergedUpToIncludingLayer = convertIzzySearchQueryToIss3(
                mergedUpToIncludingLayer
            )
        }

        let diff = diffJson(mergedUpToPreviousLayer, mergedUpToIncludingLayer)

        if (i > 0 && !(
            diff.some(sentence => sentence.added) ||
            diff.some(sentence => sentence.removed)
        )) {
            diff = null
        }

        diffedLayers.push({
            name: formattedLayers[i].name,
            diff,
        })
    }
    return diffedLayers
}

export default DebugPersonalisation