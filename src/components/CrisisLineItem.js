/* @flow */

import React from "react";
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";
import _ from "underscore";

import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import icons from "../icons";
import iss from '../iss';

import Phone from "./Phone";

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

        for (var kind of ['freecall', 'phone', 'mobile']) {
            var phone = _.findWhere(object.phones, {kind: kind});

            if (phone) {
                return (
                    <div className="CrisisLineItem">
                        <h3 className="crisisName"> {object.name}
                        </h3>
                        <Phone {...phone} />
                    </div>
                    );
            }
        }

        return null;
    }
}

export default CrisisLineItem;
