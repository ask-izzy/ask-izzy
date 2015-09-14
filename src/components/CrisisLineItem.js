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

    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.domesticviolence};

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

        return null;
    }
}

export default CrisisLineItem;
