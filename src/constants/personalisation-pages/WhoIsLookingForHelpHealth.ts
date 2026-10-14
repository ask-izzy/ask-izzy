import type {
    PersonalisationLookingForHelpPage,
} from "@/types/personalisation-page"
import WhoIsLookingForHelp from "./WhoIsLookingForHelp"

export default ({
    ...WhoIsLookingForHelp,
    name: WhoIsLookingForHelp.name + "-health",
} as PersonalisationLookingForHelpPage)