import type {
    PersonalisationLookingForHelpPage,
} from "@/types/personalisation-page.js"


import WhoIsLookingForHelp from "@/src/constants/personalisation-pages/WhoIsLookingForHelp.js"


export default ({
    ...WhoIsLookingForHelp,
    name: WhoIsLookingForHelp.name + "-everyday-things",
} as PersonalisationLookingForHelpPage)