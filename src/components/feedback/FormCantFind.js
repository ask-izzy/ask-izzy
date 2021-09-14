/* @flow */

import React, {useState} from "react";
import {notificationApi} from "../../utils/notifications.service"
import icons from "../../icons"

function FormFeedbackCantFind() {

    const [form, setForm] = useState({
        notRelevant: "",
        notClose: "",
        other: "",
        comments: "",
    })
    const [formError, setFormError] = useState("")
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)



    const isValid = () => {
        if (
            !form.other &&
            !form.notRelevant &&
            !form.notClose
        ) {
            setFormError("Please select at least one option.")
            return false;
        }

        if (
            form.other &&
            !form.comments
        ) {
            setFormError("Please use the text box to tell us which \
                 details are incorrect or deselect 'other'.",
            )
            return false;
        }

        return true;
    }

    const onSubmit = async(event: SyntheticInputEvent<>): void => {
        event.preventDefault();
        if (isValid()) {
            setLoading(true)
            const response = await notificationApi().post("message/send/", {
                action: "email",
                environment: "askizzy",
                provider: "smtp",
                notifications: {
                    "template": "cant-find",
                    "id": 3,
                    "notifications": [
                        {
                            "replacements": form,
                        },
                    ],
                },
            })

            if (response) {
                setFormSubmitted(true);
                setLoading(true);
            } else {
                let reason = "Something went wrong, please try again."
                if (response) {
                    reason = response.data.detail ?
                        response.data.detail
                        : response.data.error
                }
                setFormSubmitted(true);
                setLoading(true);
                setFormError(reason)
            }
        } else {
            setFormError("Please give us a little more \
                information about your feedback."
            )
        }
    }

    const onChange = (event: SyntheticInputEvent<>): void => {
        const target = event.target;
        const value = target.type === "checkbox" ?
            target.checked
            : target.value;
        const name = target.name;

        setForm({[name]: value})
    }

    const submitButton = () => {
        if (loading) {
            return (
                <button
                    className="loading"
                    type="submit"
                >
                    <icons.Loading /> Sending
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
                                    Not near me
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
                            {form.other &&
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

export default FormFeedbackCantFind
