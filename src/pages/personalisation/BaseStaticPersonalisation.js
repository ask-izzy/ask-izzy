/* @flow */
import * as React from "react";

import HeaderBar from "../../components/HeaderBar";
import components from "../../components";
import {getCategory} from "../../constants/categories"
import storage from "../../storage";
import {getBannerName} from "../../utils/personalisation"
import routerContext from "../../contexts/router-context";
import type {
    PersonalisationInfoPage,
} from "../../../flow/personalisation-page"
import LgbtiqaDomesticViolenceScreen
    from "./static-page-contents/LgbtiqaDomesticViolenceScreen"
import Under18DomesticViolenceScreen
    from "./static-page-contents/Under18DomesticViolenceScreen"
import UsingViolenceScreen from "./static-page-contents/UsingViolenceScreen"
import OnlineSafetyScreen from "./static-page-contents/OnlineSafetyScreen"

type Props = {|
    onDoneTouchTap: () => void,
    backToAnswers?: boolean,
    details: PersonalisationInfoPage,
    goBack?: () => void
|}

class BaseStaticPersonalisation extends React.Component<Props> {
    static contextType: any = routerContext;

    onDoneTouchTap(): void {
        storage.setItem(this.props.details.name, true);
        this.props.onDoneTouchTap();
    }

    renderDoneButton(): ?React.Element<any> {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
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
        const category = getCategory(
            this.context.router.match.params.page
        )
        const bannerName = getBannerName(category, this.props.details.name)
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

export default BaseStaticPersonalisation;
