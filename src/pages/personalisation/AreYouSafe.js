/* @flow */

import * as React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";
import storage from "../../storage";
import components from "../../components";

export default class AreYouSafe extends BaseQuestion {
    static title = "Safety";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "are-you-safe",
        question: "Are you safe right now?",
        byline:
            "All of your answers are private and anonymous",
        answers: {
            "No": append(""),
            "I'm not sure": append(""),
            "Yes": append(""),
        },
        icons: {
            "No": icons.Cross,
            "I'm not sure": icons.QuestionMark,
            "Yes": icons.Tick,
        },
        showOnlineSafetyLink: true,
    };

    get customPageTitle(): string {
        if (typeof window !== "undefined" && this.shouldRenderSafetyDetails) {
            return "Help";
        }

        return "";
    }

    get customBackMessage(): string {
        if (typeof window !== "undefined" && this.shouldRenderSafetyDetails) {
            return this.constructor.title;
        }
        return "";
    }

    get shouldRenderSafetyDetails(): boolean {
        return [
            "",
            "Yes",
            "(skipped)",
        ].indexOf(this.selected) === -1;
    }

    nextStep(): void {
        if (this.shouldRenderSafetyDetails) {
            return;
        }

        super.nextStep();
    }

    onPreviousStep(): boolean {
        if (this.shouldRenderSafetyDetails) {
            storage.setItem(this.props.name, "");
            this.setState({ selected: null });
            return false;
        }

        return true;
    }

    get question(): string {
        if (this.shouldRenderSafetyDetails) {
            return "Everyone has the right to be safe";
        }

        return this.props.question;
    }

    renderDoneButton(): ?React.Element<any> {
        if (this.shouldRenderSafetyDetails) {
            return (
                <div>
                    <div className="done-button">
                        <components.FlatButton
                            label="CONTINUE"
                            autoFocus={true}
                            onClick={this.props.onDoneTouchTap}
                        />
                    </div>
                </div>
            );
        }

        return super.renderDoneButton();
    }

    render(): React.Node {
        if (this.shouldRenderSafetyDetails) {
            const link1800Respect = "/service/634190-1800respect";
            const number1800Respect = "1800 737 732";

            let isMobile;

            if (typeof window !== "undefined") {
                isMobile = window.innerWidth <= 768;
            } else {
                isMobile = false;
            }

            return (
                <div className="AreYouSafe">
                    {this.renderHeaderBar()}
                    <div className="safety-message">
                        <icons.PhoneCalling className="PhoneIcon" />
                        <h2>
                            If you or someone else is in danger call{' '}
                            {
                                isMobile ? (
                                    <a href="tel:000">000</a>
                                ) : (
                                    "000"
                                )
                            }
                        </h2>
                        <h3>
                            If you don't feel safe in your life, call{' '}
                            <a href={link1800Respect}>1800 Respect</a> for
                            confidential counselling, support and services
                        </h3>
                        <h3>
                            <a href={link1800Respect}>1800 Respect</a> on{' '}
                            {
                                isMobile ? (
                                    <a href={`tel:${number1800Respect}`}>
                                        {number1800Respect}
                                    </a>
                                ) : (
                                    `${ number1800Respect }`
                                )
                            }
                        </h3>
                    </div>
                    {this.renderDoneButton()}
                    {this.renderOnlineSafetyLink()}
                </div>
            );
        }

        return super.render();
    }
}
