/* @flow */

"use strict";

import React from 'react';
import mui from "material-ui";
import reactMixin from "react-mixin";
import sessionstorage from "sessionstorage";

import Personalisation from '../../mixins/Personalisation';
import components from '../../components';
import icons from '../../icons';

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
        question: '',
        /* possible answers to the question */
        answers: [],
    };

    // flow:disable
    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    constructor(props: Object) {
        super(props);
        this.state = {};
    };

    // flow:disable
    static get summaryValue(): string {
        return sessionstorage.getItem(this.name);
    }

    onAnswerTouchTap(answer: string): void {
        sessionstorage.setItem(this.constructor.name, answer);
        this.nextStep();
    }

    render(): React.Element {
        var selected = sessionstorage.getItem(this.constructor.name);

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
