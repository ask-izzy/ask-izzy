/* @flow */

import React from "react";
import Router from "react-router";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import mui from "material-ui";
import reactMixin from "react-mixin";
import _ from "underscore";
import icons from "../icons";
import iss from '../iss';

var palette = colors.getPalette();

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class CrisisLineItem extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            relatedServices: [],  // includes us, use this.relatedServices
        };
    }

    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
        nRelatedServices: React.PropTypes.number,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.ixa};

    // flow:disable
    static defaultProps =  {
        nRelatedServices: 4,
    };

    /**
     * relatedServices:
     * A list of related services, limited to 4
     */
    /* flow:disable */
    get relatedServices(): Array<Object> {
        return this.state.relatedServices
            .slice(0, this.props.nRelatedServices);
    }

    /**
     * nMoreRelatedServices:
     * The number of related services minus the 4 relatedServices.
     */
    /* flow:disable */
    get nMoreRelatedServices(): number {
        return Math.max(0,
                        this.state.relatedServices.length -
                            this.props.nRelatedServices);
    }

    componentDidMount(): void {
        /* request our sibling services */
        iss('search/', {
            site_id: this.props.object.site.id,
            type: 'service',
        })
            .then(data => {
                /* remove ourselves */
                var relatedServices =
                    _.reject(data.objects,
                             service => service.id == this.props.object.id);
                this.setState({relatedServices: relatedServices});
            });
    }

    render(): React.Element {
        var {
            object,
        } = this.props;

        var crisisType = "";

        for (var kind of ['freecall', 'phone', 'mobile']) {
            var phone = _.findWhere(object.phones, {kind: kind});

            if (phone) {

                if (kind == "freecall") {
                    var crisisType = "Freecall";
                }

                return (

                        <mui
                            className="CrisisLineItem"
                            >

                                <div className="crisisName"> {object.name}
                                </div>

                                <icons.Phone className="phoneIcon" />
                                <div className="crisisItem">
                                 {crisisType} {phone.number}</div>

                        </mui>
                    );
            }
        }

    }
}

export default CrisisLineItem;
