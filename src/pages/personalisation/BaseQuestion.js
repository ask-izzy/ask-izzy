/* @flow */

import React from "react";
import mui from "material-ui";
import reactMixin from "react-mixin";
import { debounce } from "core-decorators";
import _ from "underscore";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
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

    replace(search: string|iss.searchRequest): ReplaceSearch {
        let next = replace(search);

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

        if (this.search.age_groups) {
            search.age_groups = (search.age_groups || [])
                .concat(this.search.age_groups);
        }

        return search;
    }
}

export function append(search: string|iss.searchRequest): AppendToSearch {
    return new AppendToSearch(search);
}

/**
 * Subclass for completely replacing search terms.
 */
class ReplaceSearch extends Search {
    compose(search) {
        return super.compose(this.search);
    }
}

export function replace(search: string|iss.searchRequest): ReplaceSearch {
    return new ReplaceSearch(search);
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

        return search;
    }
}

export function remove(search: string|iss.searchRequest): RemoveSearch {
    return new RemoveSearch(search);
}

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class BaseQuestion extends React.Component {
    // flow:disable
    static propTypes = {
        /* The question asked of the user */
        question: React.PropTypes.string.isRequired,
        /* possible answers to the question */
        answers: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.node),
            React.PropTypes.objectOf(React.PropTypes.node),
        ]).isRequired,
    };

    // flow:disable
    static defaultProps = {
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            selected: null,  // set when the user makes a choice
        };
    }

    // flow:disable
    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    // flow:disable
    static get summaryValue(): string {
        return this.answer;
    }

    /** Provide a string to be used in the search results heading. */
    // flow:disable
    static get headingValue(): string {
        return "";
    }

    // flow:disable
    static get answer(): string {
        return storage.getItem(this.defaultProps.name);
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
        var value = this.answer;

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
     * @returns {Array<nodes>} an array of React nodes.
     */
    // flow:disable
    get answers(): Array<ReactElement> {
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
        storage.setItem(this.props.name, this.state.selected);
        this.nextStep();
    }

    onAnswerTouchTap(answer: string, ...rest: any): void {
        this.setState({selected: answer});
        this.triggerNext();
    }

    render(): ReactElement {
        var selected =
            this.state.selected || storage.getItem(this.props.name);

        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight />
                            {this.props.question}
                        </div>
                    }
                />
                <mui.List className="List">
                {this.answers.map((answer, index) =>
                    <mui.ListItem
                        className="ListItem"
                        key={index}
                        primaryText={answer}
                        leftCheckbox={
                            <mui.RadioButton
                                checked={answer == selected}
                                value={answer}
                                onCheck={this.onAnswerTouchTap.bind(
                                    this, answer)}
                                disableFocusRipple={true}
                                disableTouchRipple={true}
                            />
                        }
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />)}
                </mui.List>

            </div>
        );
    }
}

export default BaseQuestion;
