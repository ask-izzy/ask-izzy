/* @flow */
/* eslint-disable max-len */

import React from "react";
import PropTypes from "proptypes";
import ServicePane from "../components/ServicePane";

import iss from "../iss";
import type {Service} from "../iss";
import components from "../components";
import Loading from "../icons/Loading";
import config from "../config";
import routerContext from "../contexts/router-context";
import {emitPageLoadEvent} from "../utils";

class ServicePage extends React.Component<{
    params: {
        slug: string,
    },
    match: any,
}, {
    object?: Service,
    error?: Object,
}> {
    static propTypes = {
        match: PropTypes.object,
    };

    static contextType = routerContext;

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    async componentDidMount(): Promise<void> {
        await this.loadService();
        emitPageLoadEvent();
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (this.id !== this.extractId(this.context.router.match.params.slug)) {
            this.loadService()
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

    async loadService(): Promise<void> {
        // Unload previous service
        this.setState({object: undefined});

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
                        onBackTouchTap={this.context.router.history.goBack}
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
                                            <a href={"mailto:" + config.default.siteMail}>{config.default.siteMail}</a>.
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
                        onBackTouchTap={this.context.router.history.goBack}
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }
}

export default ServicePage;
