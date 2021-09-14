/* @flow */

import React, {useState} from "react";
import icons from "../../icons"
import {notificationApi} from "../../utils/notifications.service"

function FormFindInformation () {

    const [form, setForm] = useState({
        didyoufind: "",
        comments: "",
    })
    const [formError, setFormError] = useState("")
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const isValid = () => {
        return form.comments;
    }

    const onSubmit = async(event: SyntheticInputEvent<>): void => {
        event.preventDefault();
        if (isValid()) {
            setLoading()
            const response = await notificationApi().post("message/send/", {
                action: "email",
                environment: "askizzy",
                provider: "sendgrid",
                notifications: {
                    "template": "test-template",
                    "id": "1",
                    "notifications": [
                        {
                            "replacements": {
                                "didyoufind": form.didyoufind,
                                "comments": form.comments,
                            },
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
        event.preventDefault()
        const target = event.target;
        const value = target.type === "checkbox" ?
            target.checked
            : target.value;
        const name = target.name;

        setForm({...form, [name]: value})
        isValid()
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
        <div className="FormFindInformation">
            <form
                onSubmit={onSubmit}
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
                        onChange={onChange}
                        value="yes"
                    />
                    <label htmlFor="yes">Yes</label>
                    <input
                        type="radio"
                        id="no"
                        name="didyoufind"
                        onChange={onChange}
                        value="no"
                    />
                    <label htmlFor="no">No</label>
                </div>
                {!formSubmitted && form.didyoufind &&
                <div className="moreInformation">
                    <label htmlFor="feedbackMoreInformation">
                        Any comments?
                    </label>
                    <textarea
                        id="feedbackMoreInformation"
                        name="comments"
                        rows="5"
                        onChange={onChange}
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

export default FormFindInformation
