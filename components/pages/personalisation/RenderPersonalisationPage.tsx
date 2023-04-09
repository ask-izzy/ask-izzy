import React from "react"
import {useRouter} from "next/router"

import BaseQuestion from "@/components/pages/personalisation/BaseQuestion.js"
import BaseStaticPersonalisation from "@/components/pages/personalisation/BaseStaticPersonalisation.js"
import WhoIsLookingForHelp from "@/components/pages/personalisation/WhoIsLookingForHelp.js"
import Location from "@/components/pages/personalisation/Location.js"
import {
    getCurrentPersonalisationPage,
} from "@/src/utils/routing.js"


function RenderPersonalisationPage() {
    const router = useRouter()
    const personalisationPage = getCurrentPersonalisationPage(router);
    if (!personalisationPage) {
        throw new Error("Could not get personalisation page")
    }
    let PageComponent
    if (personalisationPage.type === "question") {
        PageComponent = BaseQuestion
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <div className="PersonalisationPage">
                <PageComponent
                    key={personalisationPage.name}
                    details={personalisationPage}
                />
            </div>
        )
    } else if (personalisationPage.type === "info") {
        PageComponent = BaseStaticPersonalisation
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <div className="PersonalisationPage">
                <PageComponent
                    key={personalisationPage.name}
                    details={personalisationPage}
                />
            </div>
        )
    } else if (personalisationPage.type === "who-is-looking-for-help") {
        PageComponent = WhoIsLookingForHelp
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <div className="PersonalisationPage">
                <PageComponent
                    key={personalisationPage.name}
                    details={personalisationPage}
                />
            </div>
        )
    } else if (personalisationPage.type === "location") {
        PageComponent = Location
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <div className="PersonalisationPage">
                <PageComponent
                    key={personalisationPage.name}
                    details={personalisationPage}
                />
            </div>
        )
    } else {
        return <div>
            Error rendering:
            <pre>{JSON.stringify(personalisationPage, null, 2)}</pre>
        </div>
    }
}

export default RenderPersonalisationPage
