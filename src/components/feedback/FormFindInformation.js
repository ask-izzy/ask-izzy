/* @flow */

import React, {useState} from "react";
import type {Node as ReactNode} from "react";
import Loading from "../../icons/Loading";
import API from "axios"

type State = {
    formSubmitted: boolean,
    formError: string,
    input: Object,
    loading: boolean,
}

let NOTIFICATIONS_API_URL = "";

if (typeof window !== "undefined" && window.NOTIFICATIONS_API_URL) {
    NOTIFICATIONS_API_URL = window.NOTIFICATIONS_API_URL;
}

export default function FormFindInformation(): ReactNode {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const [input, setInput] = useState<Object>({
        didyoufind: "",
        comments: "",
        page: window.location.pathname.replace(/^\/+/g, ""),
    });

    function isValid(): boolean {
        if (
            !input.comments
        ) {
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
                    "template": "did-you-find",
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
                        disabled={formSubmitted}
                        value="yes"
                    />
                    <label htmlFor="yes">Yes</label>
                    <input
                        type="radio"
                        id="no"
                        name="didyoufind"
                        onChange={onChange}
                        disabled={formSubmitted}
                        value="no"
                    />
                    <label htmlFor="no">No</label>
                </div>
                {!formSubmitted && input.didyoufind &&
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
