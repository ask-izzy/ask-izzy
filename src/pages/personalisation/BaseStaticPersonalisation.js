/* @flow */
import * as React from "react";
import type { ElementConfig as ReactElementConfig } from "react"

import Personalisation from "../../mixins/Personalisation";
import HeaderBar from "../../components/HeaderBar";
import components from "../../components";
import storage from "../../storage";

export type Props = {
    name: string,
    heading: string,
    byline?: string,
    onDoneTouchTap: Function,
    showBaseTextBox?: boolean,
    baseTextBoxComponent?: React.Element<any>,
    classNames?: string,
    mobileView?: boolean,
    showDoneButton?: boolean,
}

class BaseStaticPersonalisation extends Personalisation<Props, {}> {
    +doneButtonLabel: ?string;

    static defaultProps: ReactElementConfig<typeof Personalisation> = {
        showBaseTextBox: false,
        showDoneButton: true,
    };

    /*
     * How should this answer be represented
     * @returns {string} A description of the question/answer
    */
    static headingValue(): string {
        return "";
    }

    static prettyPrintSavedAnswer(): string {
        return this.savedAnswer;
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
     * Determines whether or not to show the question.
     *
     * @returns {boolean} true if we should show this question.
     */
    static showPage(): boolean {
        return true;
    }

    /**
     * Determines whether or not to show the question on the summary page.
     *
     * @returns {boolean} true if we should show this on the summary page.
     */
    static showInSummary(): boolean {
        return true;
    }

    /**
     * Trigger next page after a 500ms debounce.
     *
     * @returns {void}
     */
    triggerNext(): void {
        if (typeof this.nextStep === "function") {
            this.nextStep();
        }
    }

    onDoneTouchTap(): void {
        this.props.onDoneTouchTap();
    }

    onAnswerTouchTap(): void {
        this.triggerNext();
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
                    bannerName={this.bannerName}
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
