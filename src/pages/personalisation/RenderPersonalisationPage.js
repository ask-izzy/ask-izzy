/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import BaseQuestion from "./BaseQuestion"
import BaseStaticPersonalisation from "./BaseStaticPersonalisation"
import WhoIsLookingForHelp from "./WhoIsLookingForHelp"
import Location from "./Location"

type Props = {
    personalisationPage: PersonalisationPage,
    onDoneTouchTap: () => void,
    goBack?: () => void,
    backToAnswers?: boolean,
}

export default function RenderPersonalisationPage({
    personalisationPage,
    onDoneTouchTap,
    goBack,
    backToAnswers,
}: Props): ReactNode {
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
            <PageComponent
                key={personalisationPage.name}
                details={personalisationPage}
                onDoneTouchTap={onDoneTouchTap}
                backToAnswers={false}
            />
        )
    } else if (personalisationPage.type === "info") {
        PageComponent = BaseStaticPersonalisation
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <PageComponent
                key={personalisationPage.name}
                details={personalisationPage}
                onDoneTouchTap={onDoneTouchTap}
                backToAnswers={false}
            />
        )
    } else if (personalisationPage.type === "who-is-looking-for-help") {
        PageComponent = WhoIsLookingForHelp
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <PageComponent
                key={personalisationPage.name}
                details={personalisationPage}
                onDoneTouchTap={onDoneTouchTap}
                backToAnswers={false}
            />
        )
    } else if (personalisationPage.type === "location") {
        PageComponent = Location
        // key prop is needed to force the component to be full remounted when
        // the personalisation page changes
        return (
            <PageComponent
                key={personalisationPage.name}
                details={personalisationPage}
                onDoneTouchTap={onDoneTouchTap}
                backToAnswers={false}
            />
        )
    } else {
        return <div>
            Error rendering:
            <pre>{JSON.stringify(personalisationPage, null, 2)}</pre>
        </div>
    }
}
