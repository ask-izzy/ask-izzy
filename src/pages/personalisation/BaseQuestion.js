/* @flow */

import React from "react";
import reactMixin from "react-mixin";
import { debounce } from "core-decorators";
import _ from "underscore";

import Personalisation from "../../mixins/Personalisation";
import HeaderBar from "../../components/HeaderBar";
import LogoWithShadow from "../../components/LogoWithShadow";
import InputListItem from "../../components/InputListItem";
import FlatButton from "../../components/FlatButton";

import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";
import { append, Search } from "../../iss/Search";

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class BaseQuestion extends React.Component {
    props: Object;
    state: Object;

    static defaultProps: Object = {};

    static propTypes = {
        name: React.PropTypes.string.isRequired,
        /* The question asked of the user */
        question: React.PropTypes.string.isRequired,
        /* possible answers to the question */
        answers: React.PropTypes.oneOfType([
            React.PropTypes.objectOf(React.PropTypes.object),
        ]).isRequired,
        onDoneTouchTap: React.PropTypes.func,
        suppressDoneButton: React.PropTypes.bool,
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            selected: null, // set when the user makes a choice
        };
    }

    get selected(): string {
        return this.state.selected || storage.getItem(this.props.name) || "";
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
        if (_.isArray(this.props.answers)) {
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
        storage.setItem(this.props.name, this.selected || "(skipped)");
    }

    onAnswerTouchTap(answer: string, ...rest: any): void {
        this.setState({selected: answer});
        this.triggerNext();
    }

    render() {
        const selected = this.selected;

        return (
            <div>
                <HeaderBar
                    primaryText={
                        <div>
                            <LogoWithShadow />
                            {this.props.question}
                        </div>
                    }
                />
                <div className="List">
                {this.answers.map((answer, index) =>
                    <InputListItem
                        key={index}
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
            </div>
        );
    }

    renderDoneButton() {
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
