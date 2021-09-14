/* @flow */

import React, {useState} from "react";
import icons from "../../icons"
import {notificationApi} from "../../utils/notifications.service";

function FormReportError() {

    const [form, setForm] = useState({
        opening: "",
        location: "",
        contactDetails: "",
        other: "",
        comments: "",
    })
    const [formError, setFormError] = useState("")
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const isValid = () => {
        if (
            !form.opening &&
            !form.location &&
            !form.contactDetails &&
            !form.other
        ) {
            setFormError("Please select at least one option.")
            return false;
        }

        if (
            form.other &&
            !form.comments
        ) {
            setFormError("Please use the text box to tell us which \
                 details are incorrect or deselect 'other'.")
            return false;
        }

        return true;
    }

    const onSubmit = async(event: SyntheticInputEvent<>): void => {
        event.preventDefault();
        if (isValid()) {
            setLoading(true)
            const response = notificationApi().post("/message/send/", {
                action: "email",
                environment: "askizzy",
                provider: "smtp",
                notifications: {
                    "template": "error-report",
                    "id": "2",
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
                information about your feedback.")
        }
    }

    const onChange = (event: SyntheticInputEvent<>): void => {
        const target = event.target;
        const value = target.type === "checkbox" ?
            target.checked
            : target.value;
        const name = target.name;
        setForm({...form, [name]: value})
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
        <div className="FormReportError">
            {formError &&
                <p className="formError">{formError}</p>
            }
            {!formSubmitted &&
            <form
                onSubmit={onSubmit}
                className={loading ? "loading" : ""}
            >
                <span>Please tell us which details are incorrect</span>

                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="feedbackOpening"
                            onChange={onChange}
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
                            onChange={onChange}
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
                            onChange={onChange}
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
                            onChange={onChange}
                        />
                        <label htmlFor="feedbackOther">
                            Other
                        </label>
                    </li>
                </ul>

                {form.other &&
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
                            onChange={onChange}
                        >
                            {form.comments}
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

export default FormReportError
