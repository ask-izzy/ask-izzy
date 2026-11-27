/*
 * How demographic answers are described in "People also searched for"
 * suggestion labels. Answers describe the person ("Under 18") so in a label
 * they're the group the services are for ("for under 18s"). Removing one
 * makes the search broader rather than leaving anyone out, so that's
 * "not just for under 18s" rather than "without under 18".
 * See docs/other-services-panel.md § "Labelling suggestions"
 */
import type {SuggestionLabel} from "@/types/personalisation-page"

function forGroup(group: string): SuggestionLabel {
    return {with: `for ${group}`, without: `not just for ${group}`}
}

const demographicSuggestionLabels: {[answer: string]: SuggestionLabel} = {
    "Aboriginal and/or Torres Strait Islander":
        forGroup("Aboriginal and Torres Strait Islander people"),
    "Couples": forGroup("couples"),
    "Escaping family violence": forGroup("people escaping family violence"),
    "Experiencing violence": forGroup("people experiencing violence"),
    "Family with children": forGroup("families with children"),
    "Have a disability": forGroup("people with disability"),
    "Have cultural needs and don't speak English":
        forGroup("people with cultural and language needs"),
    "LGBTIQA+": forGroup("LGBTIQA+ people"),
    "Mental or emotional difficulties":
        forGroup("people with mental or emotional difficulties"),
    "Parole / recently released":
        forGroup("people on parole or recently released"),
    "Person seeking asylum": forGroup("people seeking asylum"),
    "Under 18": forGroup("under 18s"),
    "Using violence": forGroup("people using violence"),
    "Veteran": forGroup("veterans"),
}

export default demographicSuggestionLabels

// For "Would you like Aboriginal & Torres Strait Islander specific services?"
export const indigenousServicesSuggestionLabel: SuggestionLabel =
    forGroup("Aboriginal and Torres Strait Islander people")
