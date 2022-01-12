/* @flow */
import * as React from "react";

import HeaderBar from "../../components/HeaderBar";
import components from "../../components";
import {getCategory} from "../../constants/categories"
import storage from "../../storage";
import {getBannerName} from "../../utils/personalisation"
import routerContext from "../../contexts/router-context";
import type {
    PersonalisationPageProps,
} from "../../utils/personalisation";

export type Props = {
    ...PersonalisationPageProps,
    heading: string,
    showDoneButton?: boolean,
}

// We need to create the defaultProps out of the component first otherwise flow
// doesn't typecheck it
const defaultProps: Props = {
    showBaseTextBox: false,
    showDoneButton: true,
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,
};

class BaseStaticPersonalisation extends React.Component<Props, {}> {
    static contextType: any = routerContext;

    +doneButtonLabel: ?string;

    static defaultProps: Props = defaultProps

    /*
     * How should this answer be represented
     * @returns {string} A description of the question/answer
    */
    static headingValue(): string {
        return "";
    }

    static prettyPrintAnswer(answer: string): string {
        return answer;
    }

    static get savedAnswer(): string {
        let answer = storage.getItem(this.defaultProps.name);

        if (typeof answer !== "string") {
            return "";
        }

        return answer;
    }

    get heading(): string {
        return this.props.heading;
    }

    /**
     * Determines whether or not to show the question on the summary page.
     *
     * @returns {boolean} true if we should show this on the summary page.
     */
    static getShouldShowInSummary(): boolean {
        return false;
    }

    onDoneTouchTap(): void {
        this.props.onDoneTouchTap();
    }

    onAnswerTouchTap(): void {
        this.props.onDoneTouchTap();
    }

    renderContent(): React.Node {
        return <React.Fragment />;
    }

    renderDoneButton(): ?React.Element<any> {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
                        label={
                            this.doneButtonLabel ?
                                this.doneButtonLabel
                                : "Continue"
                        }
                        autoFocus={true}
                        onClick={this.onDoneTouchTap.bind(this)}
                    />
                </div>
            </div>
        );
    }

    render(): React.Node {
        const category = getCategory(
            this.context.router.match.params.page
        )
        const bannerName = getBannerName(category, this.props.name)
        return (
            <div>
                <HeaderBar
                    primaryText={
                        <div>
                            {this.heading}
                        </div>
                    }
                    secondaryText={
                        this.props.byline
                    }
                    fixedAppBar={true}
                    bannerName={bannerName}
                />
                <main>
                    <div className="body">
                        {this.renderContent()}
                        {
                            this.props.showBaseTextBox &&
                            Boolean(this.props.baseTextBoxComponent) && (
                                <div className="TextBannerContainer">
                                    {this.props.baseTextBoxComponent}
                                </div>
                            )
                        }
                        {this.props.showDoneButton && this.renderDoneButton()}
                    </div>
                </main>
            </div>
        );
    }
}

export default BaseStaticPersonalisation;
