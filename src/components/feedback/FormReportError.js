/* @flow */

import React from "react";
import Loading from "../../icons/Loading";
import API from "axios"

type Props = {}

type State = {
    formSubmitted: boolean,
    formError: string,
    input: Object,
    loading: boolean,
}

let NOTIFICATIONS_API_URL = "";
let NOTIFICATIONS_API_KEY = "";

if (typeof window !== "undefined" && window.NOTIFICATIONS_API_URL) {
    NOTIFICATIONS_API_URL = window.NOTIFICATIONS_API_URL;
    NOTIFICATIONS_API_KEY = window.NOTIFICATIONS_API_KEY;
}

export default class FormReportError extends React.Component<Props, State> {

    state = {
        formSubmitted: false,
        formError: "",
        input: {
            opening: "",
            location: "",
            contactDetails: "",
            other: "",
            comments: "",
        },
        loading: false,
    }

    isValid = () => {
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

    onSubmit = (event: SyntheticInputEvent<>): void => {
        event.preventDefault();
        if (this.isValid()) {
            this.setState({
                loading: true,
            })
            API.post(`${NOTIFICATIONS_API_URL}message/send/`, {
                action: "email",
                environment: "askizzy-test",
                provider: "smtp",
                notifications: {
                    "template": "3",
                    "id": "feedback-form",
                    "notifications": [
                        {
                            "replacements": this.state.input,
                        },
                    ],
                },
            }, {
                headers: {
                    "Authorization": `Api-Key ${NOTIFICATIONS_API_KEY}`,
                },
            })
                .then((response) => {
                    this.setState({
                        formSubmitted: true,
                        loading: false,
                        formError: "",
                    })
                })
                .catch((error) => {
                    let reason = "Something went wrong, please try again."
                    if (error.response) {
                        reason = error.response.data.detail ?
                            error.response.data.detail
                            : error.response.data.error
                    }

                    this.setState({
                        formSubmitted: false,
                        loading: false,
                        formError: reason,
                    })
                })

        } else {
            this.setState({
                formError: "Please give us a little more \
                information about your feedback.",
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
        const {formSubmitted, formError, loading} = this.state;
        const submitButton = () => {
            if (loading) {
                return (
                    <button
                        className="loading"
                        type="submit"
                    >
                        <Loading /> Sending
                    </button>
                )
            }
            return (<button type="submit">Send feedback</button>)
        }
        return (
            <div className="FormReportError">
                {formError &&
                    <p className="formError">{formError}</p>
                }
                {!formSubmitted &&
                <form
                    onSubmit={this.onSubmit}
                    className={loading ? "loading" : ""}
                >
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
                        {submitButton()}
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