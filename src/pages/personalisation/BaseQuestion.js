/* @flow */

"use strict";

import React from 'react';
import mui from "material-ui";
import reactMixin from "react-mixin";

import Personalisation from '../../mixins/Personalisation';
import components from '../../components';
import icons from '../../icons';

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class BaseQuestion extends React.Component {
    // flow:disable
    static propTypes = {
        question: React.PropTypes.string.isRequired,
        answers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    };

    // flow:disable
    static defaultProps = {
        question: '',
        answers: [],
    };

    constructor(props: Object) {
        super(props);
        this.state = {};
    };

    onTouchDoneButton(event: Event): void {
        event.preventDefault();
        this.nextStep();
    }

    // flow:disable
    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    render(): React.Element {
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
                    />)}

            </div>
        );
    }
}

export default BaseQuestion;
