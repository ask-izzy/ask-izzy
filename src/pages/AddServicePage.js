/* @flow */

import React from "react";

import components from "../components";

declare var ISS_URL: string;

class AddServicePage extends React.Component {

    constructor(props: Object): void {
        super(props);

        this.state = {
            isFormDone: false,
        };
    }

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.addEventListener("message", (event) => {
                let origin = event.origin || event.originalEvente.origin;

                if (origin !== ISS_URL || event.data !== "formSubmitted") {
                    return;
                }

                this.setState({
                    isFormDone: true,
                });
            }, false);
        }
    }

    render(): ReactElement {
        let history = this.props.history;

        let body = this.state.isFormDone ? this.renderSuccessMessage()
            : this.renderForm();

        return (
            <div className="AddServicePage">
                <components.AppBar
                    title="Add a service"
                    onBackTouchTap={history.goBack.bind(history)}
                />

                <div className="body">
                    {body}
                </div>
            </div>
        );
    }

    renderSuccessMessage(): ReactElement {
        return (
            <div>
                <p>Thanks. We'll put some better content here soon.</p>
            </div>
        );
    }

    renderForm(): ReactElement {
        return (
            <div>
                <p>
                    If you think your service is good enough for Izzy,
                    fill in the form below to list your service. Be
                    careful though, only the very best services are
                    allowed.
                </p>

                <iframe src={`${ISS_URL}/add-service-form?form=ask-izzy`} />
            </div>
        );
    }

}

export default AddServicePage;
