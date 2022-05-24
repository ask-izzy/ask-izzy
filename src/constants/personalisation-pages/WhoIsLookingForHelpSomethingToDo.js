/* @flow */
import type {
    PersonalisationLookingForHelpPage,
} from "@/flow/personalisation-page"
import WhoIsLookingForHelp from "./WhoIsLookingForHelp"

export default ({
    ...WhoIsLookingForHelp,
    name: WhoIsLookingForHelp.name + "-something-to-do",
}: PersonalisationLookingForHelpPage)