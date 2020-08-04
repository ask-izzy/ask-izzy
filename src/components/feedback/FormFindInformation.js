/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";

type State = {
    formSubmitted: boolean,
    formError: string,
    input: Object,
}

export default class FormFindInformation extends React.Component<{}, State> {

    state: State = {
        formSubmitted: false,
        formError: "",
        input: {
            didyoufind: "",
            comments: "",
        },
    }

    isValid: () => boolean = () => {
        if (
            !this.state.input.comments
        ) {
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
        } else {
            this.setState({
                formError: "Please give us a little more \
                information about your feedback.",
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
        this.isValid()
    }

    render(): ReactNode {
        const {formSubmitted, formError} = this.state;

        return (
            <div className="FormFindInformation">
                <form onSubmit={this.onSubmit}>
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
                        />
                        <label htmlFor="yes">Yes</label>
                        <input
                            type="radio"
                            id="no"
                            name="didyoufind"
                            onChange={this.onChange}
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
                            <button type="submit">Send feedback</button>
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
