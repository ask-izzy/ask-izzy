/* @flow */
import * as React from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

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
} from "@/flow/personalisation-page"
import LgbtiqaDomesticViolenceScreen
from "./static-page-contents/LgbtiqaDomesticViolenceScreen"
import Under18DomesticViolenceScreen
from "./static-page-contents/Under18DomesticViolenceScreen"
import UsingViolenceScreen from "./static-page-contents/UsingViolenceScreen"
import OnlineSafetyScreen from "./static-page-contents/OnlineSafetyScreen"

type Props = {|
    details: PersonalisationInfoPage,
    router: NextRouter
|}

class BaseStaticPersonalisation extends React.Component<Props> {
    onDoneTouchTap(): void {
        storage.setItem(this.props.details.name, true);
        goToPersonalisationNextPath({router: this.props.router})
    }

    renderDoneButton(): ?React.Element<any> {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label={this.props.details.getDoneButtonLabel()}
                        autoFocus={true}
                        onClick={this.onDoneTouchTap.bind(this)}
                    />
                </div>
            </div>
        );
    }

    renderContent(): React.Node {
        const contentComponents = {
            "lgbtiqa-domestic-violence": LgbtiqaDomesticViolenceScreen,
            "under-18-dfv": Under18DomesticViolenceScreen,
            "using-violence": UsingViolenceScreen,
            "online-safety-screen": OnlineSafetyScreen,
        }

        const ContentComponent = contentComponents[this.props.details.name]

        return <ContentComponent />
    }

    render(): React.Node {
        const category = getCategoryFromRouter(this.props.router)
        const bannerName = getBannerName(category, this.props.details.name)
        const goBackPath = getPersonalisationBackPath(this.props.router)
        const isSummaryRoute = goBackPath.includes("/summary")
        return (
            <div>
                <HeaderBar
                    primaryText={
                        <div>
                            {this.props.details.heading}
                        </div>
                    }
                    secondaryText={
                        this.props.details.byline
                    }
                    fixedAppBar={true}
                    bannerName={bannerName}
                    backUrl={isSummaryRoute ? goBackPath : undefined}
                    backMessage={isSummaryRoute ? "Back to answers" : undefined}
                />
                <main>
                    <div className="body">
                        {this.renderContent()}
                        {this.props.details.baseTextBoxComponent && (
                            <div className="TextBannerContainer">
                                {this.props.details.baseTextBoxComponent}
                            </div>
                        )}
                        {this.renderDoneButton()}
                    </div>
                </main>
            </div>
        );
    }
}

export default (
    withRouter(BaseStaticPersonalisation):
        Class<
            React$Component<
                $Diff<
                    React.ElementConfig<typeof BaseStaticPersonalisation>,
                    {router: *}
                >
            >
        >
)