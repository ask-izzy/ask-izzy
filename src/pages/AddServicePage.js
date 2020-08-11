/* @flow */

import url from "url";
import React from "react";

import components from "../components";
import history from "../utils/history";

declare var ISS_URL: string;

type Props = {}

type State = {
    isFormDone: boolean,
}

class AddServicePage extends React.Component<Props, State> {
    issUrl: any; // Flowtype core declares url.parse(): any
    handleMessage: Function;

    constructor(props: Object): void {
        super(props);

        this.state = {
            isFormDone: false,
        };

        this.handleMessage = this.handleMessage.bind(this);
        this.issUrl = "";

        if (ISS_URL) {
            this.issUrl = url.parse(ISS_URL);
            delete this.issUrl.auth;
        }
    }

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.addEventListener("message", this.handleMessage, false);
        }

    }

    componentWillUnmount(): void {
        if (typeof window !== "undefined") {
            window.removeEventListener("message", this.handleMessage);
        }
    }

    handleMessage(event: MessageEvent): void {
        const origin = event.origin

        if (origin !== `${this.issUrl.protocol}//${this.issUrl.hostname}`) {
            return;
        }

        switch (typeof event === "object" && event.data) {
        case "formSubmitted":
            this.setState({
                isFormDone: true,
            });
            break;

        case "formLoaded":
            window.scrollTop(0, 0);
            break;

        default:
            break;
        }
    }

    render() {
        const body = this.state.isFormDone ? this.renderSuccessMessage()
            : this.renderForm();

        return (
            <div className="AddServicePage">
                <components.AppBar
                    title="Add a service"
                    onBackTouchTap={history.back}
                />

                <div className="body">
                    {body}
                </div>
            </div>
        );
    }

    renderSuccessMessage() {
        return (
            <div>
                <p>Thank you. The information you provided may be adjusted for
                consistency in presentation and will be available online
                within seven (7) calendar days from submission.</p>
            </div>
        );
    }

    renderForm() {
        const issUrl = url.format(this.issUrl);

        return (
            <div>
                <p>
                    The service listings on Ask Izzy come
                    from <a href="https://www.infoxchange.org">
                    Infoxchange</a>&apos;s Service Seeker database,
                    Australia&apos;s largest up-to-date directory of
                    health and welfare services.
                </p>
                <p>
                    We would love your help keeping the service listings
                    as current as possible.
                </p>
                <p>
                    <strong>
                        If you notice that service information is incorrect:
                    </strong>
                </p>
                <p>
                    We know that service and program information changes all
                    the time. If you think that a listing needs updating or
                    you see an error, please&nbsp;
                    <a
                        href={
                            "mailto:support@askizzy.org.au" +
                                "?subject=" +
                                encodeURIComponent(
                                    `Your Ask Izzy feedback`) +
                                "&body=" +
                                encodeURIComponent(
                                    `Service name:

                                    Contact name:

                                    Contact number:

                                    Contact email:

                                    Details of change:

                                    `.replace(/^ +/gm, "")
                                )
                        }
                    >
                        email to let us know
                    </a>.
                </p>
                <p>
                    <strong>
                        If you want to add a new service:
                    </strong>
                </p>
                <p>
                    If your service doesn&apos;t appear when you search for
                    it on Ask Izzy, we&apos;d love you to submit a new service
                    listing using the form below. Your entry will then be
                    checked by our database team before it gets added.
                </p>
                <p>
                    We know the form is quite long! Unfortunately it needs
                    to be – we gather as much information as possible so we
                    can put people in touch with the right services for their
                    needs. Note that not all the fields need to be filled in
                    and we will follow up with you if we need any additional
                    information.
                </p>
                <p>
                    If your service is complex (e.g. the same service is
                    offered at multiple sites or there are complex
                    eligibility criteria) or if you&apos;re having trouble with
                    the form, <a href="mailto:database@infoxchange.org">email
                    us</a> some basic information about the service and
                    we&apos;ll contact you to find out more.
                </p>

                <iframe src={`${issUrl}/add-service-form?form=ask-izzy`} />
            </div>
        );
    }
}

export default AddServicePage;
