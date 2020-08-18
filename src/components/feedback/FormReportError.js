/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";

type Props = {}

type State = {
    formSubmitted: boolean,
    formError: string,
    input: Object,
}

export default class FormReportError extends React.Component<Props, State> {

    state: State = {
        formSubmitted: false,
        formError: "",
        input: {
            opening: "",
            location: "",
            contactDetails: "",
            other: "",
            comments: "",
        },
    }

    isValid: () => boolean = () => {
        if (
            !this.state.input.opening &&
            !this.state.input.location &&
            !this.state.input.contactDetails &&
            !this.state.input.other
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

    onSubmit: (event: SyntheticInputEvent<>) => void = (event) => {
        event.preventDefault();
        if (this.isValid()) {
            this.setState({
                formSubmitted: true,
                formError: "",
            })
        }
    }

    onChange: (event: SyntheticInputEvent<>) => void = (event) => {
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

    render(): ReactNode {
        const {formSubmitted, formError} = this.state;

        return (
            <div className="FormReportError">
                {formError &&
                    <p className="formError">{formError}</p>
                }
                {!formSubmitted &&
                <form onSubmit={this.onSubmit}>
                    <span>Please tell us which details are incorrect</span>

                    <ul>
                        <li>
                            <input
                                type="checkbox"
                                id="feedbackOpening"
                                onChange={this.onChange}
                                name="opening"
                            />
                            <label htmlFor="feedbackOpening">
                                Opening times
                            </label>
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                id="feedbackLocation"
                                name="location"
                                onChange={this.onChange}
                            />
                            <label htmlFor="feedbackLocation">
                                Location
                            </label>
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                id="feedbackContactDetails"
                                name="contactDetails"
                                onChange={this.onChange}
                            />
                            <label htmlFor="feedbackContactDetails">
                                Contact details
                            </label>
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                id="feedbackOther"
                                name="other"
                                onChange={this.onChange}
                            />
                            <label htmlFor="feedbackOther">
                                Other
                            </label>
                        </li>
                    </ul>

                    {this.state.input.other &&
                        <div className="moreInformation">
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
                            >
                                {this.state.input.comments}
                            </textarea>
                        </div>
                    }

                    <div className="formControls">
                        <button type="submit">Send feedback</button>
                    </div>
                </form>
                }
                {formSubmitted &&
                    <p>Thanks for your feedback!</p>
                }
            </div>
        )
    }
}
