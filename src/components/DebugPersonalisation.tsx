import React, {useState} from "react";
import {diffJson} from "diff";
import { useRouter } from "next/router"

import {
    getSearchQueryModifiers,
    buildSearchQueryFromModifiers,
    SearchQuery,
} from "@/src/iss/searchQueryBuilder.js"
import {convertIzzySearchQueryToIss3} from "@/src/iss/serviceSearch.js"
import Button from "@/src/components/base/Button.js"
import Diff, {DiffType} from "@/src/components/debug/Diff.js"
import DebugContainer from "@/src/components/DebugContainer.js";
import IssParamsOverrideControls from "@/src/components/debug/IssParamsOverrideControls.js";
import Storage from "@/src/storage.js";


type Props = {
    issQuery: SearchQuery,
    setIssParamsOverride: (
        issParamsOverride?: Record<string, any>,
        triggerNewSearch?: boolean
    ) => void
}

type DiffedLayer = {
    name: string,
    diff: DiffType | null
}

function DebugPersonalisation({
    issQuery,
    setIssParamsOverride,
}: Props) {
    if (typeof window === "undefined") {
        return null
    }
    const [convertToISSQuery, setConvertToISSQuery] = useState(true)
    const router = useRouter()

    const searchQueryModifiers = getSearchQueryModifiers(router)
        .filter(layer => layer)

    const originalIssQuery = convertIzzySearchQueryToIss3(
        issQuery,
    )

    const diffedLayers: DiffedLayer[] =
        getDiffedLayers(searchQueryModifiers, convertToISSQuery)

    return (
        <DebugContainer
            message="Debug ISS Query"
            initiallyExpanded={
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
                                false,
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
    convertToISSQuery,
): DiffedLayer[] {
    const formattedLayers = convertToISSQuery ?
        searchQueryModifiers.map(layer => ({
            ...layer,

        }))
        : searchQueryModifiers
    const diffedLayers: DiffedLayer[] = []
    for (let i = 0; i < formattedLayers.length; i++) {
        let mergedUpToPreviousLayer = buildSearchQueryFromModifiers(
            formattedLayers.slice(0, i || 1),
        )
        let mergedUpToIncludingLayer = buildSearchQueryFromModifiers(
            formattedLayers.slice(0, i + 1),
        )


        if (convertToISSQuery) {
            mergedUpToPreviousLayer = convertIzzySearchQueryToIss3(
                mergedUpToPreviousLayer,
            ) as SearchQuery
            mergedUpToIncludingLayer = convertIzzySearchQueryToIss3(
                mergedUpToIncludingLayer,
            ) as SearchQuery
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