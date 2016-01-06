/* @flow */

import React from "react";
import { History } from "react-router";
import ServicePane from "../components/ServicePane";
import reactMixin from "react-mixin";

import iss from "../iss";
import components from "../components";
import Loading from "../icons/Loading";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class ServicePage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.loadService();
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (prevProps.params.slug != this.props.params.slug) {
            this.loadService();
        }
    }

    /**
     * Pull out the ID (leading digits) from the slug
     */
    /* flow:disable not supported yet */
    get id(): number {
        const leadingDigits = /^\d+/;
        let slug = this.props.params.slug;

        return parseInt(slug.match(leadingDigits)[0]);
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

    render(): ReactElement {
        let {
            object,
            error,
        } = this.state;
        let history = this.props.history;

        if (!object) {
            return (
                <div className="ServicePage">
                    <components.AppBar
                        title="Loading..."
                        onBackTouchTap={history.goBack.bind(history)}
                    />
                    <div className="ServicePane">
                        <main>
                            {
                                error ?
                                <div className="error">
                                    Whoops - something went wrong
                                    (error {error.statusCode})
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
                        onBackTouchTap={history.goBack.bind(history)}
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }

}

export default ServicePage;
