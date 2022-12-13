import React from "react"
import {useRouter} from "next/router"

import BaseQuestion from "@/components/pages/personalisation/BaseQuestion"
import BaseStaticPersonalisation from "@/components/pages/personalisation/BaseStaticPersonalisation"
import WhoIsLookingForHelp from "@/components/pages/personalisation/WhoIsLookingForHelp"
import Location from "@/components/pages/personalisation/Location"
import {
    getCurrentPersonalisationPage,
} from "@/src/utils/routing"

function RenderPersonalisationPage() {
    const router = useRouter()
    const personalisationPage = getCurrentPersonalisationPage(router);
    if (!personalisationPage) {
        throw new Error("Could not get personalisation page")
    }
    let PageComponent
    // We should be able to just return the rendered PageComponent
    // once after the if statements but unfortunately flow is dumb and forgets
    // that after the if statements `personalisationPage` and `PageComponent`
    // must have a relationship. Hopefully we can clean this up when we move
    // to typescript.
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
