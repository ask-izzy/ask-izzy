import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import storage from "@/src/storage"

export type OtherServicesSuggestionTarget = {
    type: "category",
    category: Category,
    // Personalisation answers implied by the suggestion, keyed by
    // personalisation page name
    answers: {[personalisationPageName: string]: string},
} | {
    type: "search",
    searchText: string,
}

// Compare labels loosely so "Drugs & Alcohol Counselling" matches the
// "Drugs and alcohol counselling" subcategory answer.
function normaliseLabel(label: string): string {
    return label
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
}

/*
 * Work out where a suggestion should take the user. A suggestion matching a
 * category name or one of a category's subcategory answers goes to that
 * category, otherwise it becomes a keyword search.
 * See docs/other-services-panel.md § "What clicking a suggestion does"
 */
export function getOtherServicesSuggestionTarget(
    label: string
): OtherServicesSuggestionTarget {
    const wanted = normaliseLabel(label)
    const listedCategories = categories.filter(
        category => !category.dontShowInCategoryList
    )

    for (const category of listedCategories) {
        if (normaliseLabel(category.name) === wanted) {
            return {type: "category", category, answers: {}}
        }
    }

    for (const category of listedCategories) {
        const subcategoryPage = category.personalisation.find(
            page => page.name === `${category.key}-subcategory`
        )
        if (subcategoryPage?.type !== "question") {
            continue
        }
        const answer = Object.keys(subcategoryPage.possibleAnswers).find(
            possibleAnswer => normaliseLabel(possibleAnswer) === wanted
        )
        if (answer) {
            return {
                type: "category",
                category,
                answers: {[subcategoryPage.name]: answer},
            }
        }
    }

    return {type: "search", searchText: label}
}

/*
 * The path to send the user to for a suggestion. This deliberately leaves out
 * the location and personalisation pages: the results page works those out
 * from the saved answers when it loads, showing results if every answer is
 * known or the personalisation wizard if more are needed.
 */
export function getOtherServicesSuggestionPath(
    target: OtherServicesSuggestionTarget
): string {
    if (target.type === "category") {
        return `/${target.category.key}`
    }
    return `/search/${encodeURIComponent(target.searchText)}`
}

export function saveOtherServicesSuggestionAnswers(
    target: OtherServicesSuggestionTarget
): void {
    if (target.type !== "category") {
        return
    }
    for (const [pageName, answer] of Object.entries(target.answers)) {
        storage.setItem(pageName, answer)
    }
}
