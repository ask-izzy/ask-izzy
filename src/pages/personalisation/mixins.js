/* @flow */

/* eslint-disable id-length */ // request.q has to be that short.

/**
 * Implements getSearchForAnswer for a question by
 * adding the text of the answer to the search query
 *
 * @param {iss.searchRequest} request - A request whose `q` will be modified
 * @param {Set<string>|string} answers - The users answer to a Question
 * @returns {iss.searchRequest} - {request} after updating `q`
 */
function getSearchForAnswerText(
    request: {q: string},
    answers: Set<string>|string
): {q: string} {
    if (typeof answers === "string") {
        request.q = `${request.q} ${answers}`;
    } else {
        request.q = [request.q].concat([
            /*::{_:`*/
            for (answer of answers) answer
            /*::`}*/
        ]).join(" ");
    }

    return request;
}

export function SearchOnSubcategoryText(klass: Function): void {
    klass.getSearchForAnswer = getSearchForAnswerText;
}

/**
 * Implements getSearchForAnswer for a question
 * via a predefined map of {question => query}
 *
 * @param {Object} validAnswers - Maps the possible answers to search params
 * @returns {Function} - Decorator which provides getSearchForAnswer
 */
export function SearchByMap(validAnswers: Object): Function {
    function getSearchForAnswerMap(
        request: {q: string},
        answers: Set<string>|string
    ): {q: string} {
        if (typeof answers === "string") {
            request.q = `${request.q} ${validAnswers[answers] || ""}`;
        } else {
            request.q = [request.q].concat([
                /*::{_:`*/
                for (answer of answers)
                    if (validAnswers[answer])
                        validAnswers[answer]
                /*::`}*/
            ]).join(" ");
        }

        return request;
    }

    return function(klass: Function): void {
        klass.getSearchForAnswer = getSearchForAnswerMap;
    }
}
