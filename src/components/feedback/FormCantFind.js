/* @flow */

import React, {useState} from "react";
import type {Node as ReactNode} from "react";

import Loading from "../../icons/Loading";
import API from "axios"

type State = {
    formSubmitted: boolean,
    loading: boolean,
    formError: string,
    input: Object,
}

let NOTIFICATIONS_API_URL = "";
let NOTIFICATIONS_API_KEY = "";

if (typeof window !== "undefined" && window.NOTIFICATIONS_API_URL) {
    NOTIFICATIONS_API_URL = window.NOTIFICATIONS_API_URL;
    NOTIFICATIONS_API_KEY = window.NOTIFICATIONS_API_KEY;
}

export default function FormFeedbackCantFind(): ReactNode {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const [input, setInput] = useState<Object>({
        notRelevant: "",
        notClose: "",
        other: "",
        comments: "",
        page: window.location.pathname.replace(/^\/+/g, ""),
    });

    function isValid(): boolean {
        if (
            !input.other &&
            !input.notRelevant &&
            !input.notClose
        ) {
            setFormError("Please select at least one option.");
            return false;
        }

        if (
            input.other &&
            !input.comments
        ) {
            setFormError("Please use the text box to tell us which \
                 details are incorrect or deselect 'other'.");
            return false;
        }

        return true;
    }

    function onSubmit(event: SyntheticInputEvent<>): void {
        event.preventDefault();
        const NOTIFICATIONS_API_URL_OBJ = new URL(NOTIFICATIONS_API_URL)
        if (isValid()) {
            setLoading(true);
            API.post(`${NOTIFICATIONS_API_URL_OBJ.protocol}//` +
            `${NOTIFICATIONS_API_URL_OBJ.host}/api/v1/message/send/`, {
                action: "email",
                environment: "askizzy-test",
                provider: "smtp",
                notifications: {
                    "template": "cant-find",
                    "id": "feedback-form",
                    "notifications": [
                        {
                            "replacements": input,
                        },
                    ],
                },
            }, {
               headers: {
                    "Authorization": `Api-Key ${decodeURIComponent(
                        NOTIFICATIONS_API_URL_OBJ.username
                    )}`,
                },
            })
                .then((response) => {
                    setFormSubmitted(true);
                    setLoading(false);
                    setFormError("");
                })
                .catch((error) => {
                    let reason = "Something went wrong, please try again."
                    if (error.response) {
                        reason = error.response.data.detail ?
                            error.response.data.detail
                            : error.response.data.error
                    }
                    setFormSubmitted(false);
                    setLoading(false);
                    setFormError(reason);
                })

        } else {
            setFormError("Please give us a little more \
                information about your feedback.");
        }
    }

    function onChange(event: SyntheticInputEvent<>): void {
        const target = event.target;
        const value = target.type === "checkbox" ?
            target.checked
            : target.value;
        const name = target.name;

        setInput(prevState => ({
                ...prevState,
                [name]: value,
        }));
    }

    function submitButton() {
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
                onSubmit={onSubmit}
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
                                    onChange={onChange}
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
                                    onChange={onChange}
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
                                    onChange={onChange}
                                />
                                <label htmlFor="FeedbackResultsOther">
                                    Other
                                </label>
                            </li>
                        </ul>

                        <div className="moreInformation">
                            {input.other &&
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
                                        onChange={onChange}
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
