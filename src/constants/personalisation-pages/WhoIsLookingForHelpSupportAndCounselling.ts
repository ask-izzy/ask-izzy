import type {
    PersonalisationLookingForHelpPage,
} from "@/types/personalisation-page"
import WhoIsLookingForHelp from "@/src/constants/personalisation-pages/WhoIsLookingForHelp"

export default ({
    ...WhoIsLookingForHelp,
    name: WhoIsLookingForHelp.name + "-support-and-counselling",
} as PersonalisationLookingForHelpPage)