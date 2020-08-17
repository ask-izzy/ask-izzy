/* @flow */

import React from "react";

type State = {
    formSubmitted: boolean,
    formError: string,
    input: Object,
}

export default class FormFeedbackCantFind extends React.Component<{}, State> {

    state = {
        formSubmitted: false,
        formError: "",
        input: {
            notRelevant: "",
            notClose: "",
            other: "",
            comments: "",
        },
    }

    isValid = () => {
        if (
            !this.state.input.other &&
            !this.state.input.notRelevant &&
            !this.state.input.notClose
        ) {
            this.setState({
                formError: "Please select at least one option.",
            })
            return false;
        }

        if (
            this.state.input.other &&
            !this.state.input.comments
        ) {
            this.setState({
                formError: "Please use the text box to tell us which \
                 details are incorrect or deselect 'other'.",
            })
            return false;
        }

        return true;
    }

    onSubmit = (event: SyntheticInputEvent<>): void => {
        event.preventDefault();
        if (this.isValid()) {
            this.setState({
                formSubmitted: true,
                formError: "",
            })
        }
    }

    onChange = (event: SyntheticInputEvent<>): void => {
        const target = event.target;
        const value = target.type === "checkbox" ?
            target.checked
            : target.value;
        const name = target.name;

        this.setState(prevState => ({
            input: {
                ...prevState.input,
                [name]: value,
            },
        }));

    }

    render() {
        const {formSubmitted, formError} = this.state;

        return (
            <div className="FormCantFind">
                <form onSubmit={this.onSubmit}>
                    <h4>
                        Can&apos;t find what you&apos;re looking for?
                        The results above are:
                    </h4>
                    {formError &&
                        <p className="formError">{formError}</p>
                    }

                    {!formSubmitted &&
                        <div>
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        name="notRelevant"
                                        id="FeedbackResultsNotRelevant"
                                        onChange={this.onChange}
                                    />
                                    <label htmlFor="FeedbackResultsNotRelevant">
                                        Not relevant
                                    </label>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        name="notClose"
                                        id="FeedbackResultsNotCloseEnough"
                                        onChange={this.onChange}
                                    />
                                    <label
                                        htmlFor="FeedbackResultsNotCloseEnough"
                                    >
                                        Not close enough
                                    </label>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        name="other"
                                        id="FeedbackResultsOther"
                                        onChange={this.onChange}
                                    />
                                    <label htmlFor="FeedbackResultsOther">
                                        Other
                                    </label>
                                </li>
                            </ul>

                            <div className="moreInformation">
                                {this.state.input.other &&
                                    <div>
                                        <label
                                            htmlFor="feedbackMoreInformation"
                                        >
                                            Any comments?
                                        </label>
                                        <textarea
                                            id="feedbackMoreInformation"
                                            name="comments"
                                            rows="5"
                                            onChange={this.onChange}
                                        />
                                    </div>
                                }
                                <div className="formControls">
                                    <button type="submit">Send feedback</button>
                                </div>
                            </div>
                        </div>
                    }
                    {formSubmitted &&
                        <p>Thanks for your feedback!</p>
                    }
                </form>
            </div>
        );
    }
}
