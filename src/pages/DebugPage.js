/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import {useEffect, useState} from "react";
import type {Node as ReactNode} from "react"
// import Link from "../components/base/Link";
import StaticPage from "./StaticPage";
import categories from "../constants/categories";
import storage from "../storage";
import stringify from "json-stable-stringify";
import { getSearchQueryModifiers, buildSearchQueryFromModifiers} from "../iss/searchQueryBuilder"
import {convertIzzySearchQueryToIss3} from "../iss/serviceSearch"

/* eslint-disable complexity */

// This is all very bad and dirty code but it exists solely as a tool to aid
// testing of the ISS 4 migration.

function DebugPage(): ReactNode {
    const [queue, setQueue] = useState([])
    const [total, setTotal] = useState(0)
    async function getAllPossibleIzzyQueries() {
        const possiblePersonalisationAnswers = []
        function getAllPossiblePersonalisationAnswers(personalisationPages): Array<{[string]: string | null}> {
            if (!personalisationPages.length) {
                return []
            }
            const personaliationPage = personalisationPages[0]
            const answers: Array<{[string]: string | null}> = []
            const subAnswers = getAllPossiblePersonalisationAnswers(personalisationPages.slice(1))
            const possibleAnswers = Object.keys(personaliationPage.defaultProps.possibleAnswers || {}).concat(null)
            for (const possibleAnswer of possibleAnswers) {
                console.log(personaliationPage.defaultProps.name)
                let encodedAnswer
                if (personaliationPage.defaultProps.name === "who-is-looking-for-help") {
                    encodedAnswer = "User Myself"
                } else if (personaliationPage.defaultProps.name === "location") {
                    encodedAnswer = "Melbourne, VIC"
                } else if (!personaliationPage.defaultProps.name) {
                    encodedAnswer = true
                } else if (personaliationPage.defaultProps.multipleChoice) {
                    if (possibleAnswer === null) {
                        encodedAnswer = JSON.stringify([])
                    } else {
                        encodedAnswer = JSON.stringify([possibleAnswer])
                    }
                } else {
                    if (possibleAnswer === null) {
                        encodedAnswer = "(skipped)"
                    } else {
                        encodedAnswer = possibleAnswer
                    }
                }
                console.log(encodedAnswer)
                const possibleQuestionAndAnswer = {
                    [personaliationPage.defaultProps.name]: encodedAnswer,
                }
                if (subAnswers.length) {
                    answers.push(
                        ...(subAnswers.map(
                            singleSubAnswers => ({...possibleQuestionAndAnswer, ...singleSubAnswers})
                        ))
                    )
                } else {
                    answers.push(possibleQuestionAndAnswer)
                }
            }
            return answers
        }
        for (const category of categories) {
            const answers = getAllPossiblePersonalisationAnswers(category.personalisation)
            const router = {
                match: {
                    params: {
                        page: category.key,
                    },
                },
            }
            for (const singleSetOfAnswers of answers) {
                possiblePersonalisationAnswers.push({
                    router,
                    answers: singleSetOfAnswers,
                })

            }
        }
        return possiblePersonalisationAnswers//.slice(0, 100)
    }

    async function batchConvertIzzyToIssQuery(possiblePersonalisationAnswers) {
        const possiblePersonalisationQueries = []
        for (const singleSetOfPossiblePersonalisationAnswers of possiblePersonalisationAnswers) {
            const formattedAnswers = [`category=${singleSetOfPossiblePersonalisationAnswers.router.match.params.page}`]
            for (const [key, value] of Object.entries(singleSetOfPossiblePersonalisationAnswers.answers)) {
                if (storage.getItem(key) !== value) {
                    // $FlowIgnore
                    storage.setItem(key, value, false);
                }
                // $FlowIgnore
                formattedAnswers.push(`${key}=${value}`)
            }
            const searchQueryModifiers = getSearchQueryModifiers(singleSetOfPossiblePersonalisationAnswers.router)
            // $FlowIgnore
            const searchQuery = buildSearchQueryFromModifiers(searchQueryModifiers)
            const issSearchQuery = convertIzzySearchQueryToIss3(searchQuery)
            possiblePersonalisationQueries.push({
                formattedAnswers: formattedAnswers.join(", "),
                query: issSearchQuery,
            })
        }
        return possiblePersonalisationQueries
    }

    const [possiblePersonalisationQueries, setPossiblePersonalisationQueries] = useState([])
    useEffect(() => {
        getAllPossibleIzzyQueries().then(queries => {
            setTotal(queries.length);
            setQueue(queries)
        })
    }, [])

    useEffect(() => {
        (async() => {
            if (!queue.length) {
                return
            }
            const queueCopy = [...queue]
            const batch = queueCopy.splice(0, 10)
            const additionalQueries = await batchConvertIzzyToIssQuery(batch)
            await possiblePersonalisationQueries
            setPossiblePersonalisationQueries(possiblePersonalisationQueries => ([
                ...possiblePersonalisationQueries,
                ...additionalQueries,
            ]))
            setQueue(queueCopy)
        })()
    }, [queue])

    return (
        <StaticPage
            bannerName="money-help static"
            className="DebugPage"
            title="Debug Page"
            bannerPrimary="Debug page"
        >
            {queue.length !== 0 && <p>
                <div>Loading: {total - queue.length} / {total}</div>
                <progress min={0}
                    max={total}
                    value={total - queue.length}
                />
            </p>}
            {queue.length === 0 && (
                <textarea
                    value={stringify(possiblePersonalisationQueries, {space: 2})}
                    style={{width: "100%", height: "300px"}}
                />
            )}
        </StaticPage>
    );
}

export default DebugPage
