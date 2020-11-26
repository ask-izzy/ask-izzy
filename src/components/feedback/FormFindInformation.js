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

export default class FormFindInformation extends React.Component<{}, State> {

    state = {
        formSubmitted: false,
        formError: "",
        loading: false,
        input: {
            didyoufind: "",
            comments: "",
        },
    }

    isValid = () => {
        if (
            !this.state.input.comments
        ) {
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
                environment: "askizzy",
                provider: "smtp",
                notifications: {
                    "template": 1,
                    "id": "find-information",
                    "notifications": [
                        {
                            "replacements": {
                                "didyoufind": this.state.input.didyoufind,
                                "comments": this.state.input.comments,
                            },
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
        this.isValid()
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
            <div className="FormFindInformation">
                <form
                    onSubmit={this.onSubmit}
                    className={loading ? "loading" : ""}
                >
                    <h4>
                        Did you find the information you were
                         looking for on this page?
                    </h4>
                    <div className="radioGroup">
                        <input
                            type="radio"
                            id="yes"
                            name="didyoufind"
                            onChange={this.onChange}
                            value="yes"
                        />
                        <label htmlFor="yes">Yes</label>
                        <input
                            type="radio"
                            id="no"
                            name="didyoufind"
                            onChange={this.onChange}
                            value="no"
                        />
                        <label htmlFor="no">No</label>
                    </div>
                    {!formSubmitted && this.state.input.didyoufind &&
                    <div className="moreInformation">
                        <label htmlFor="feedbackMoreInformation">
                            Any comments?
                        </label>
                        <textarea
                            id="feedbackMoreInformation"
                            name="comments"
                            rows="5"
                            onChange={this.onChange}
                        />
                        {formError &&
                            <p className="formError">{formError}</p>
                        }
                        <div className="formControls">
                            {submitButton()}
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
