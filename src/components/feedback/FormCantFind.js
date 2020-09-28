/* @flow */

import React from "react";
import Loading from "../../icons/Loading";
import API from "axios"

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

export default class FormFeedbackCantFind extends React.Component<{}, State> {

    state = {
        formSubmitted: false,
        formError: "",
        loading: false,
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
                loading: true,
            })
            API.post(`${NOTIFICATIONS_API_URL}message/send/`, {
                action: "email",
                environment: "askizzy-test",
                provider: "smtp",
                notifications: {
                    "template": "2",
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
            <div className="FormCantFind">
                <form
                    onSubmit={this.onSubmit}
                    className={loading ? "loading" : ""}
                >
                    {!formSubmitted &&
                        <h4>
                            Can&apos;t find what you&apos;re looking for?
                            The results above are:
                        </h4>
                    }
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
                                        Not near me
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
                                    {submitButton()}
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
