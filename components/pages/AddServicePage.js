/* @flow */
import type {Element as ReactElement} from "React";
import React from "react";

import Link from "@/src/components/base/Link";
import HeaderBar from "@/src/components/HeaderBar";
import BrandedFooter from "@/src/components/BrandedFooter";
import * as gtm from "@/src/google-tag-manager";

type Props = {}

type State = {
    isFormDone: boolean,
}

class AddServicePage extends React.Component<Props, State> {
    handleMessage: Function;

    constructor(props: Object): void {
        super(props);

        this.state = {
            isFormDone: false,
        };

        this.handleMessage = this.handleMessage.bind(this);
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
        if (event.origin !== process.env.NEXT_PUBLIC_ISS_BASE_URL) {
            return;
        }

        switch (event.data) {
        case "formSubmitted":
            this.setState({
                isFormDone: true,
            });
            gtm.emit({
                event: "Input Submitted - Add Service",
                eventCat: "Input submitted",
                eventAction: "Add service",
                eventLabel: null,
                sendDirectlyToGA: true,
            });
            break;

        case "formLoaded":
            window.scrollTo(0, 0);
            break;

        default:
            break;
        }
    }

    render(): ReactElement<"div"> {
        const body = this.state.isFormDone ? this.renderSuccessMessage()
            : this.renderForm();

        return (
            <div className="AddServicePage">
                <HeaderBar
                    primaryText="Add a service"
                    bannerName="homepage"
                />
                <main>
                    <div className="body">
                        {body}
                    </div>
                </main>
                <BrandedFooter />
            </div>
        );
    }

    renderSuccessMessage(): ReactElement<"div"> {
        return (
            <div>
                <p>Thank you. The information you provided may be adjusted for
                consistency in presentation and will be available online
                within seven (7) calendar days from submission.</p>
            </div>
        );
    }

    renderForm(): ReactElement<"div"> {
        const formUrl = process.env.NEXT_PUBLIC_ISS_BASE_URL +
            `/add-service-form?form=ask-izzy`
        return (
            <div>
                <p>
                    The service listings on Ask Izzy come
                    from <Link to="https://www.infoxchange.org">
                    Infoxchange</Link>&apos;s Service Seeker database,
                    Australia&apos;s largest up-to-date directory of
                    health and welfare services.
                </p>
                <p>
                    We would love your help keeping the service listings
                    as current as possible.
                </p>
                <h2>
                    If you notice that service information is incorrect:
                </h2>
                <p>
                    We know that service and program information changes all
                    the time. If you think that a listing needs updating or
                    you see an error, please email{" "}
                    <Link
                        to={
                            `mailto:${process.env.NEXT_PUBLIC_SITE_EMAIL}` +
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
                        {process.env.NEXT_PUBLIC_SITE_EMAIL}
                    </Link>.
                </p>
                <h2>
                    If you want to add a new service:
                </h2>
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
                    the form, email us at{" "}
                    <Link to="mailto:database@infoxchange.org">
                        database@infoxchange.org
                    </Link>{" "}
                    some basic information about the service and we&apos;ll
                    contact you to find out more.
                </p>

                <iframe
                    title="Add Service Form"
                    src={formUrl}
                />
            </div>
        );
    }
}

export default AddServicePage;