import type {
    PersonalisationLookingForHelpPage,
} from "@/types/personalisation-page"
import WhoIsLookingForHelp from "./WhoIsLookingForHelp"

export default ({
    ...WhoIsLookingForHelp,
    name: WhoIsLookingForHelp.name + "-advocacy",
} as PersonalisationLookingForHelpPage)