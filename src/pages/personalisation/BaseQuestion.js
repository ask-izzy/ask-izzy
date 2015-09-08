/* @flow */

"use strict";

import React from 'react';
import mui from "material-ui";
import reactMixin from "react-mixin";

import Personalisation from '../../mixins/Personalisation';
import components from '../../components';
import icons from '../../icons';
import storage from '../../storage';
import * as iss from '../../iss';

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class BaseQuestion extends React.Component {
    // flow:disable
    static propTypes = {
        question: React.PropTypes.string.isRequired,
        answers: React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
    };

    // flow:disable
    static defaultProps = {
        /* The question asked of the user */
        question: null,
        /* possible answers to the question */
        answers: [],
    };

    // flow:disable
    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    // flow:disable
    static get summaryValue(): string {
        return storage.getItem(this.defaultProps.name);
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        var value = storage.getItem(this.defaultProps.name);

        if (value) {
            return this.getSearchForAnswer(request, value);
        } else {
            // this question can't been answered
            return null;
        }
    }

    static getSearchForAnswer(request: iss.searchRequest, answer: string):
        ?iss.searchRequest {
        return request;
    }

    onAnswerTouchTap(answer: string): void {
        storage.setItem(this.props.name, answer);
        this.nextStep();
    }

    render(): React.Element {
        var selected = storage.getItem(this.props.name);

        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight className="Logo" />
                            {this.props.question}
                        </div>
                    }
                />
                {this.props.answers.map((answer, index) =>
                    <mui.ListItem
                        key={index}
                        primaryText={answer}
                        leftIcon={
                            answer == selected ?
                                <icons.RadioSelected />
                            :
                                <icons.RadioUnselected />
                        }
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                        onTouchTap={this.onAnswerTouchTap.bind(this, answer)}
                    />)}

            </div>
        );
    }
}

export default BaseQuestion;
