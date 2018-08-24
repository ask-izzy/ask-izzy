/* @flow */

import * as React from "react";
import reactMixin from "react-mixin";
import { debounce } from "lodash-decorators";
import _ from "underscore";

import Personalisation from "../../mixins/Personalisation";
import HeaderBar from "../../components/HeaderBar";
import InputListItem from "../../components/InputListItem";
import FlatButton from "../../components/FlatButton";

import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";
import { append, Search } from "../../iss/Search";
import OnlineSafetyLink from "../../components/OnlineSafetyLink";

type Props = {
    name: string,
    question: string,
    byline?: string,
    classNames?: string,
    answers: Object | Array<string>,
    onDoneTouchTap: Function,
    suppressDoneButton: boolean,
    icons?: Object,
    showOnlineSafetyLink: boolean,
}

type State = {
    selected: ?string,
    rootHeight?: number,
    windowHeight?: number,
    answers?: Set<string>,
}

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class BaseQuestion extends React.Component<Props, State> {
    static defaultProps: Object = {};

    constructor(props: Object) {
        super(props);
        this.state = {
            selected: null, // set when the user makes a choice
        };
    }

    nextStep: any;

    get selected(): string {
        let storageValue;

        const valueFromStorage = storage.getItem(this.props.name)

        if (typeof valueFromStorage === 'boolean') {
            storageValue = valueFromStorage ? 'true' : 'false';
        } else {
            storageValue = valueFromStorage;
        }

        return `${(
            storageValue ||
            this.state.selected ||
            ""
        )}`;
    }

    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    static get summaryValue(): string {
        return this.answer;
    }

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

    /**
     * Modify the search query with the answers to the question. Or return
     * `null` if we don't have an answer (this will cause the question to
     * be shown).
     *
     * @param {iss.searchRequest} request - current ISS search request.
     * @returns {iss.searchRequest} modified ISS search request.
     */
    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        let value = this.answer;

        if (value == "(skipped)") {
            // This question has been skipped.
            return request;
        }

        if (value) {
            return this.getSearchForAnswer(request, value);
        } else {
            // this question hasn't been answered
            return null;
        }
    }

    static getSearchForAnswer(
        request: iss.searchRequest,
        answer: string,
    ): ?iss.searchRequest {

        let answerComposer;

        /* the answers are a map of answers to search terms */
        if (_.isObject(this.defaultProps.answers) &&
            this.defaultProps.answers[answer] instanceof Search) {

            answerComposer = this.defaultProps.answers[answer];
        } else {
            // Default behaviour for strings is to append
            answerComposer = append(answer);
        }

        return answerComposer.compose(request);
    }

    /**
     * Return the answers from the answers property element.
     *
     * @returns {Array<string>} an array of the valid answers
     * to this question.
     */
    get answers(): Array<string> {
        if (Array.isArray(this.props.answers)) {
            return this.props.answers;
        } else {
            return Object.keys(this.props.answers);
        }
    }

    /**
     * Determines whether or not to show the question.
     *
     * @returns {boolean} true if we should show this question.
     */
    static showQuestion(): boolean {
        return true;
    }

    /**
     * Trigger next page after a 500ms debounce.
     */
    /*::__(){`*/@debounce(500)/*::`}*/
    triggerNext(): void {
        if (typeof this.nextStep === "function") {
            this.nextStep();
        }
    }

    onNextStep(): void {
        storage.setItem(this.props.name, this.state.selected || "(skipped)");
    }

    iconFor(answer: string): ?React.Element<any> {
        if (this.props.icons && this.props.icons[answer]) {
            const Icon = this.props.icons[answer];

            return (
                <Icon
                    className="ColoredIcon small icon-fg-color"
                />
            );
        }
    }

    onAnswerTouchTap(answer: string, ...rest: any): void {
        this.setState({selected: answer});
        this.triggerNext();
    }

    render(): React.Node {
        const selected = this.selected;
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
            <div>
                <HeaderBar
                    primaryText={
                        <div>
                            {this.props.question}
                        </div>
                    }
                    secondaryText={
                        this.props.byline
                    }
                    bannerName={bannerName}
                    alternateBackgroundColor={false}
                />
                <div className="List">
                    {this.answers.map((answer, index) =>
                        <InputListItem
                            key={index}
                            leftIcon={this.iconFor(answer)}
                            primaryText={answer}

                            type="radio"
                            checked={answer == selected}
                            value={answer}
                            onClick={this.onAnswerTouchTap.bind(this, answer)}

                            checkedIcon={
                                <icons.RadioSelected className="big" />
                            }
                            uncheckedIcon={
                                <icons.RadioUnselected className="big" />
                            }
                        />)}
                </div>
                {this.renderDoneButton()}
                {this.renderOnlineSafetyLink()}
            </div>
        );
    }

    renderOnlineSafetyLink(): ?React$Element<*> {
        if (this.props.showOnlineSafetyLink) {
            return (
                <OnlineSafetyLink/>
            )
        }
    }

    renderDoneButton(): ?React.Element<any> {
        if (!this.props.suppressDoneButton) {
            return (
                <div>
                    <div className="done-button">
                        <FlatButton
                            className="text-link"
                            label="Skip"
                            onClick={this.props.onDoneTouchTap}
                        />
                    </div>
                </div>
            )
        }
    }
}

export default BaseQuestion;
