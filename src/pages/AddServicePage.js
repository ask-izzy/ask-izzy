/* @flow */

import url from "url";
import React from "react";

import components from "../components";

declare var ISS_URL: string;

class AddServicePage extends React.Component {
    props: Object;
    state: Object;
    issUrl: any; // Flowtype core declares url.parse(): any
    handleMessage: Function;

    constructor(props: Object): void {
        super(props);

        this.state = {
            isFormDone: false,
        };

        this.handleMessage = this.handleMessage.bind(this);
        this.issUrl = "";
    }

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.addEventListener("message", this.handleMessage, false);
        }
    }

    componentWillMount(): void {
        if (ISS_URL) {
            this.issUrl = url.parse(ISS_URL);
            delete this.issUrl;
        }
    }

    componentWillUnmount(): void {
        if (typeof window !== "undefined") {
            window.removeEventListener("message", this.handleMessage);
        }
    }

    handleMessage(event: Event): void {
        let origin = event.origin ||
            (typeof event.originalEvent == "object") &&
            event.originalEvent.origin;

        if (origin !== `${this.issUrl.protocol}//${this.issUrl.hostname}`) {
            return;
        }

        switch (typeof event == "object" && event.data) {
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
        let issUrl = url.format(this.issUrl);

        return (
            <div>
                <p>
                    Information about Service Providers is maintained in
                    Infoxchange's Service Seeker database. The database
                    supports a range of directory services provided by
                    Infoxchange including HSNet in NSW and oneplace in
                    Queensland.  Ask Izzy displays a subset of the information
                    to make it easier for Consumers to read and understand.
                    Fields that are displayed in Ask Izzy are clearly marked
                    so that you can see what will be displayed in your
                    listing.
                </p>
                <p>Information is structured at multiple levels:</p>
                <ul>
                    <li>Organisation</li>
                    <li>Site</li>
                    <li>Services and Programs</li>
                </ul>
                <p>
                    To help Ask Izzy users, please review and update
                    information for each section.  If there is no change to
                    information already on the database, please ensure you
                    complete the Service Provider name together with the
                    relevant section for the detail that is being added or
                    changed.
                </p>
                <p>
                    We are of course aware that Services and Program
                    information changes regularly. So that other Service
                    Providers and Consumers only see current information,
                    please make those updates as soon as possible via (report
                    an error link).
                </p>
                <p>
                    Information that is displayed in the Ask Izzy product is
                    noted in blue.
                </p>

                <iframe src={`${issUrl}add-service-form?form=ask-izzy`} />
            </div>
        );
    }

}

export default AddServicePage;
