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

/**
 * Base class for composing search terms.
 */
class Search {
    search: iss.searchRequest;
    chain: Search;

    constructor(search: string|iss.searchRequest) {
        if (typeof search === "string") {
            this.search = { q: search };
        } else {
            this.search = search;
        }
    }

    compose(search: iss.searchRequest): iss.searchRequest {
        // Default behaviour is to do nothing but chain up
        search = Object.assign({}, search);

        if (this.chain) {
            search = this.chain.compose(search);
        }

        return search;
    }

    /* eslint-disable no-use-before-define */
    append(search: string|iss.searchRequest): AppendToSearch {
        let next = append(search);

        next.chain = this;
        return next;
    }

    remove(search: string|iss.searchRequest): RemoveSearch {
        let next = remove(search);

        next.chain = this;
        return next;
    }
    /* eslint-enable no-use-before-define */
}

/**
 * Subclass for combining searches together.
 */
class AppendToSearch extends Search {
    compose(search) {
        search = super.compose(search);
        if (this.search.q) {
            search.q = (search.q || "") + " " + this.search.q;
        }

        if (this.search.age_group) {
            search.age_group = (search.age_group || [])
                .concat(this.search.age_group);
        }

        if (this.search.client_gender) {
            search.client_gender = (search.client_gender || [])
                .concat(this.search.client_gender);
        }

        if (this.search.is_bulk_billing) {
            search.is_bulk_billing = this.search.is_bulk_billing;
        }

        if (this.search.healthcare_card_holders) {
            search.healthcare_card_holders =
                this.search.healthcare_card_holders;
        }

        return search;
    }
}

export function append(search: string|iss.searchRequest): AppendToSearch {
    return new AppendToSearch(search);
}

/**
 * Subclass for removing a search term.
 */
class RemoveSearch extends Search {
    compose(search) {
        search = super.compose(search);

        if (search.q && this.search.q) {
            search.q = search.q.replace(this.search.q, "");
        }

        for (const key of Object.keys(this.search)) {
            if (search[key] === this.search[key]) {
                delete search[key];
            }
        }

        return search;
    }
}

export function remove(search: string|iss.searchRequest): RemoveSearch {
    return new RemoveSearch(search);
}

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class BaseQuestion extends React.Component {
    static propTypes = {
        /* The question asked of the user */
        question: React.PropTypes.string.isRequired,
        /* possible answers to the question */
        answers: React.PropTypes.oneOfType([
            React.PropTypes.objectOf(React.PropTypes.object),
        ]).isRequired,
        onDoneTouchTap: React.PropTypes.func,
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
        this.nextStep();
    }

    onNextStep(): void {
        storage.setItem(this.props.name, this.selected || "(skipped)");
    }

    onAnswerTouchTap(answer: string, ...rest: any): void {
        this.setState({selected: answer});
        this.triggerNext();
    }

    render(): ReactElement {
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
                        onChange={this.onAnswerTouchTap.bind(this, answer)}

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

    renderDoneButton(): ?ReactElement {
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
