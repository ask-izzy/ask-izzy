import React from "react";
import {withRouter} from "next/router"
import type {NextRouter} from "next/router"

import HeaderBar from "@/src/components/HeaderBar";
import FlatButton from "@/src/components/FlatButton";
import storage from "@/src/storage";
import {getBannerName} from "@/src/utils/personalisation"
import {
    getCategoryFromRouter,
    goToPersonalisationNextPath,
    getPersonalisationBackPath,
} from "@/src/utils/routing"
import type {
    PersonalisationInfoPage,
} from "@/types/personalisation-page"
import LgbtiqaDomesticViolenceScreen
    from "@/components/pages/personalisation/static-page-contents/LgbtiqaDomesticViolenceScreen"
import Under18DomesticViolenceScreen
    from "@/components/pages/personalisation/static-page-contents/Under18DomesticViolenceScreen"
import UsingViolenceScreen from "@/components/pages/personalisation/static-page-contents/UsingViolenceScreen"
import OnlineSafetyScreen from "@/components/pages/personalisation/static-page-contents/OnlineSafetyScreen"

type Props = {
    details: PersonalisationInfoPage,
    router: NextRouter
}

function BaseStaticPersonalisation({details, router}: Props) {
    const category = getCategoryFromRouter(router)
    const bannerName = getBannerName(category, details.name)
    const goBackPath = getPersonalisationBackPath(router)
    const isSummaryRoute = goBackPath.includes("/summary")

    function onDoneTouchTap(): void {
        storage.setItem(details.name, true);
        goToPersonalisationNextPath({router})
    }

    function renderDoneButton() {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label={details.getDoneButtonLabel()}
                        autoFocus={true}
                        onClick={onDoneTouchTap}
                    />
                </div>
            </div>
        )
    }

    function renderContent() {
        const contentComponents = {
            "lgbtiqa-domestic-violence": LgbtiqaDomesticViolenceScreen,
            "under-18-dfv": Under18DomesticViolenceScreen,
            "using-violence": UsingViolenceScreen,
            "online-safety-screen": OnlineSafetyScreen,
        }

        const ContentComponent = contentComponents[details.name]

        return <ContentComponent />
    }


    return (
        <div>
            <HeaderBar
                primaryText={
                    <div>
                        {details.heading}
                    </div>
                }
                secondaryText={details.byline}
                fixedAppBar={true}
                bannerName={bannerName}
                backUrl={isSummaryRoute ? goBackPath : undefined}
                backMessage={isSummaryRoute ? "Back to answers" : undefined}
            />
            <main>
                <div className="body">
                    {renderContent()}
                    {details.baseTextBoxComponent && (
                        <div className="TextBannerContainer">
                            {details.baseTextBoxComponent}
                        </div>
                    )}
                    {renderDoneButton()}
                </div>
            </main>
        </div>
    )
}
export default (withRouter(BaseStaticPersonalisation))