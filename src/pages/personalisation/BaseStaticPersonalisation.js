/* @flow */

import * as React from "react";

import Personalisation from "../../mixins/Personalisation";
import HeaderBar from "../../components/HeaderBar";
import components from "../../components";

import storage from "../../storage";

import OnlineSafetyLink from "../../components/OnlineSafetyLink";

export type Props = {
    name: string,
    heading: string,
    byline?: string,
    onDoneTouchTap: Function,
    showOnlineSafetyLink?: boolean,
    classNames?: string,
}

export type State = {
    selected: ?string,
    rootHeight?: number,
    windowHeight?: number,
}

class BaseStaticPersonalisation extends Personalisation<Props, State> {
    static defaultProps: Object = {};

    /*
     * How should this answer be represented
     * @returns {string} A description of the question/answer
    */
    static headingValue(): string {
        return "";
    }

    static get answer(): string {
        let answer = storage.getItem(this.defaultProps.name);

        if (typeof answer != "string") {
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

    renderContent(): React.Element<any> {
        return <React.Fragment />;
    }

    renderHeaderBar(): React.Element<any> {
        let bannerName = "";

        try {
            bannerName = this.context.controller.props.params.page;
        } catch (err) {
            // continue with no banner
        }

        if (this.props.name === "sub-indigenous") {
            bannerName = "atsi";
        }

        return (
            <HeaderBar
                primaryText={
                    <div>
                        {this.heading}
                    </div>
                }
                secondaryText={
                    this.props.byline
                }
                bannerName={bannerName}
                alternateBackgroundColor={false}
            />
        );
    }

    renderDoneButton(): ?React.Element<any> {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
                        label="CONTINUE"
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
                {this.renderHeaderBar()}
                {this.renderContent()}
                {this.renderDoneButton()}
                {this.props.showOnlineSafetyLink && <OnlineSafetyLink/>}
            </div>
        );
    }
}

export default BaseStaticPersonalisation;
