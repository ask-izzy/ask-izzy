import type {
    PersonalisationLookingForHelpPage,
} from "@/types/personalisation-page.js"
import WhoIsLookingForHelp from "./WhoIsLookingForHelp.js"

export default ({
    ...WhoIsLookingForHelp,
    name: WhoIsLookingForHelp.name + "-health",
} as PersonalisationLookingForHelpPage)