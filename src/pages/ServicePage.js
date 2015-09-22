/* @flow */

import React from "react";
import Router from "react-router";
import ServicePane from "../components/ServicePane";
import reactMixin from "react-mixin";

import iss from "../iss";
import components from "../components";

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
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
        var leadingDigits = /^\d+/;
        var slug = this.props.params.slug;

        return parseInt(slug.match(leadingDigits)[0]);
    }

    async loadService(): Promise<void> {
        var service = await iss.getService(this.id);

        this.setState({
            object: service,
        });
    }

    render(): ReactElement {
        var {
            object,
        } = this.state;

        if (!object) {
            return <div/>;
        } else {
            return (
                <div>
                    <components.AppBar
                        title={object.site.name}
                        onBackTouchTap={this.goBack.bind(this)}
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }

}

export default ServicePage;
