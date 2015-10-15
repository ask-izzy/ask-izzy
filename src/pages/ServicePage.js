/* @flow */

import React from "react";
import { History } from "react-router";
import ServicePane from "../components/ServicePane";
import reactMixin from "react-mixin";

import iss from "../iss";
import components from "../components";

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
        let service = await iss.getService(this.id);

        this.setState({
            object: service,
        });
    }

    render(): ReactElement {
        let {
            object,
        } = this.state;

        if (!object) {
            return <div/>;
        } else {
            let history = this.props.history;

            return (
                <div>
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
