/* @flow */
import * as React from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import storage from "@/src/storage";
import QuestionStepper from "@/src/components/QuestionStepper";
import FlatButton from "@/src/components/FlatButton";
import HeaderBar from "@/src/components/HeaderBar";
import {getCategory} from "@/src/constants/categories";
import ScreenReader from "@/src/components/ScreenReader";
import Category from "@/src/constants/Category"
import {
    goToPersonalisationNextPath,
    getPersonalisationBackPath,
} from "@/src/utils/routing"
import WhoIsLookingForHelpBaseInfo from
"@/src/constants/personalisation-pages/WhoIsLookingForHelp"
import {
    getBannerName,
} from "@/src/utils/personalisation"
import type {PersonalisationLookingForHelpPage} from
"@/flow/personalisation-page"
type Props = {
    router: NextRouter,
    details: PersonalisationLookingForHelpPage,
}

type State = {
    category: ?Category,
}

export type UserType = "User Worker" | "User Myself"| "User Someone Else"

class WhoIsLookingForHelp extends React.Component<Props, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            category: getCategory(
                props.router.query.categoryOrContentPageSlug
            ),
        }
    }

    handleButtonClick: (
        (userType: UserType) => (event: SyntheticEvent<HTMLButtonElement>) => void
    ) = (userType: UserType) =>
        (event: SyntheticEvent<HTMLButtonElement>): void => {
            storage.setItem(this.props.details.name, userType);
            storage.setItem(WhoIsLookingForHelpBaseInfo.name, userType);

            goToPersonalisationNextPath({router: this.props.router})
        }

    static prettyPrintAnswer: empty

    render(): React.Element<"div"> {
        return (
            <div className="WhoIsLookingForHelpPage">
                {this.renderHeaderSection()}
                <main
                    id="mainPageContent"
                    aria-label="Questions"
                >
                    <div className="body">
                        <fieldset>
                            <legend>
                                 I&#39;m looking for help for
                            </legend>
                            {this.renderDoneButton()}
                        </fieldset>
                    </div>
                </main>
            </div>
        );
    }

    renderDoneButton(): React.Element<"div"> {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label="A client or consumer"
                        onClick={this.handleButtonClick("User Worker")}
                    />
                    <FlatButton
                        label="Myself"
                        onClick={this.handleButtonClick("User Myself")}
                    />
                    <FlatButton
                        label="A friend or family member"
                        onClick={this.handleButtonClick("User Someone Else")}
                    />
                </div>
            </div>
        )
    }

    renderHeaderSection(): React.Element<any> {
        const goBackPath = getPersonalisationBackPath(this.props.router)
        const isSummaryRoute = goBackPath.includes("/summary")

        return (
            <section className="page-header-section">
                <HeaderBar
                    primaryText={
                        "I'm looking for help for"
                    }
                    infoText={
                        "All of your answers are private and anonymous."
                    }
                    taperColour={"LighterGrey"}
                    fixedAppBar={true}
                    bannerName={getBannerName(
                        this.state.category,
                        this.props.details.name
                    )}
                    backUrl={isSummaryRoute ? goBackPath : undefined}
                    backMessage={isSummaryRoute ? "Back to answers" : undefined}
                />
                <div className="questionsBar">
                    <ScreenReader>
                        <a
                            href="#mainPageContent"
                            aria-label={
                                "Skip your previously selected " +
                                "answers and go straight to the " +
                                "options."
                            }
                        >
                            Skip to make your selection
                        </a>
                    </ScreenReader>
                    <QuestionStepper />
                </div>
            </section>
        )
    }
}

export default (
    withRouter(WhoIsLookingForHelp):
        Class<
            React$Component<
                $Diff<
                    React.ElementConfig<typeof WhoIsLookingForHelp>,
                    {router: *}
                >
            >
        >
)
