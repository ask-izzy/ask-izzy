/* @flow */
/* eslint-disable max-len */

import React from "react";
import ServicePane from "../components/ServicePane";

import iss from "../iss";
import type {Service} from "../iss";
import components from "../components";
import Link from "../components/Link";
import Loading from "../icons/Loading";
import config from "../config";
import routerContext from "../contexts/router-context";
import type { RouterContextObject } from "../contexts/router-context";

class ServicePage extends React.Component<{}, {
    object?: Service,
    serviceId: number,
    error?: Object,
}> {
    static contextType = routerContext;

    constructor(props: Object, context: RouterContextObject) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.setState({
            serviceId: this.extractId(this.context.router.match.params.slug),
        })
        this.loadService(this.state.serviceId);
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        const serviceId = this.extractId(this.context.router.match.params.slug)
        // When a user hits a related service, make sure
        // we reload the service page details with the new
        // service details.
        if (this.state.serviceId !== serviceId) {
            this.loadService(serviceId)
        }
    }

    /**
     * Pull out the ID (leading digits) from the slug
     */
    get id(): number {
        return this.extractId(this.context.router.match.params.slug)
    }

    extractId(slug: string): number {
        const leadingDigits = /^\d+/;
        let match = slug.match(leadingDigits);

        if (match) {
            return parseInt(match[0]);
        }
        throw new Error("Bad URL (/service/[service-id must be a number]")
    }

    async loadService(serviceId: number): Promise<void> {
        // Unload previous service
        this.setState({
            object: undefined,
            serviceId,
        });

        try {
            let object = await iss.getService(this.id);

            this.setState({object});
        } catch (error) {
            this.setState({error});
        }

    }

    render() {
        let {
            object,
            error,
        } = this.state;

        if (!object) {
            return (
                <div className="ServicePage">
                    <components.AppBar
                        title="Loading..."
                        onBackTouchTap={() => this.context.router.navigate(-1)}
                    />
                    <div className="ServicePane">
                        <main>
                            {
                                error ?
                                    <div className="error">
                                        <p>
                                        Sorry, I was unable to retrieve the information for this service at this time.
                                        Please try viewing another service or contact us
                                        if the problem persists at&nbsp;
                                            <Link to={"mailto:" + config.default.siteMail}>{config.default.siteMail}</Link>.
                                        </p>
                                        <p>
                                            {
                                                error.statusCode &&
                                                    "(error: " + error.statusCode + ")"
                                            }
                                        </p>
                                    </div>
                                    : <div className="progress">
                                        <Loading className="big" />
                                    </div>
                            }
                        </main>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ServicePage">
                    <components.AppBar
                        title={object.site.name}
                        onBackTouchTap={() => this.context.router.navigate(-1)}
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }
}

export default ServicePage;
