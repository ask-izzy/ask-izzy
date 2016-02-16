/* @flow */

import React from "react";
import ServicePane from "../components/ServicePane";

import iss from "../iss";
import components from "../components";
import Loading from "../icons/Loading";

class ServicePage extends React.Component {

    static propTypes = {
        params: React.PropTypes.object,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

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
        const back = () => this.context.router.goBack();

        if (!object) {
            return (
                <div className="ServicePage">
                    <components.AppBar
                        title="Loading..."
                        onBackTouchTap={back}
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
                        onBackTouchTap={back}
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }

}

export default ServicePage;
