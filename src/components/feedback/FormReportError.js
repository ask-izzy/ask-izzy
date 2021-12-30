/* @flow */

import React, {useState} from "react";
import type {Node as ReactNode} from "react";
import Loading from "../../icons/Loading";
import API from "axios"

type Props = {}

type State = {
    formSubmitted: boolean,
    loading: boolean,
    formError: string,
    input: Object,
}

let NOTIFICATIONS_API_URL = "";

if (typeof window !== "undefined" && window.NOTIFICATIONS_API_URL) {
    NOTIFICATIONS_API_URL = window.NOTIFICATIONS_API_URL;
}

export default function FormReportError(props: Props): ReactNode {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const [input, setInput] = useState<Object>({
        opening: "",
        location: "",
        contactDetails: "",
        other: "",
        comments: "",
        page: window.location.pathname.replace(/^\/+/g, ""),
    });

    function isValid(): boolean {
        if (
            !input.opening &&
            !input.location &&
            !input.contactDetails &&
            !input.other
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
                    "template": "error-report",
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

                {input.other &&
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
                            {input.comments}
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