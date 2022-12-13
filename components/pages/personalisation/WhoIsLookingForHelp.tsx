import React, {useState} from "react";
import {withRouter} from "next/router"
import type {NextRouter} from "next/router"

import storage from "@/src/storage";
import QuestionStepper from "@/src/components/QuestionStepper";
import FlatButton from "@/src/components/FlatButton";
import HeaderBar from "@/src/components/HeaderBar";
import {getCategory} from "@/src/constants/categories";
import ScreenReader from "@/src/components/ScreenReader";
import Category from "@/src/constants/Category";
import {
    goToPersonalisationNextPath,
    getPersonalisationBackPath,
} from "@/src/utils/routing"
import WhoIsLookingForHelpBaseInfo from "@/src/constants/personalisation-pages/WhoIsLookingForHelp"
import {getBannerName} from "@/src/utils/personalisation"
import type {PersonalisationLookingForHelpPage} from "@/types/personalisation-page"

type Props = {
    router: NextRouter,
    details: PersonalisationLookingForHelpPage,
}

export type UserType = "User Worker" | "User Myself"| "User Someone Else"

function WhoIsLookingForHelp({router, details}: Props) {
    const [category] = useState<Category | undefined>(
        getCategory(
            router.query.categoryOrContentPageSlug as string,
        ),
    )

    const handleButtonClick: (
        (userType: UserType) => (event: React.SyntheticEvent<HTMLButtonElement>) => void
    ) = (userType: UserType) =>
        (): void => {
            storage.setItem(details.name, userType);
            storage.setItem(WhoIsLookingForHelpBaseInfo.name, userType);

            goToPersonalisationNextPath({router})
        }



    function renderDoneButton() {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label="A client or consumer"
                        onClick={handleButtonClick("User Worker")}
                    />
                    <FlatButton
                        label="Myself"
                        onClick={handleButtonClick("User Myself")}
                    />
                    <FlatButton
                        label="A friend or family member"
                        onClick={handleButtonClick("User Someone Else")}
                    />
                </div>
            </div>
        )
    }

    function renderHeaderSection() {
        const goBackPath = getPersonalisationBackPath(router)
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
                        category,
                        details.name,
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

    return (
        <div className="WhoIsLookingForHelpPage">
            {renderHeaderSection()}
            <main
                id="mainPageContent"
                aria-label="Questions"
            >
                <div className="body">
                    <fieldset>
                        <legend>
                                I&#39;m looking for help for
                        </legend>
                        {renderDoneButton()}
                    </fieldset>
                </div>
            </main>
        </div>
    )
}

export default (withRouter(WhoIsLookingForHelp))
