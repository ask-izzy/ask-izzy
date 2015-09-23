/* @flow */

import React from "react";
import Router from "react-router";
import _ from "underscore";

import fixtures from "../../fixtures/services";
import iss from "../iss";

import Phone from "./Phone";

class CrisisLineItem extends React.Component {

    // flow:disable not supported yet
    static displayName = "CrisisLineItem";

    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {default: {
        object: new iss.Service(fixtures.domesticviolence),
    }};

    render(): ReactElement {
        var {
            object,
        } = this.props;

        for (var kind of ["freecall", "phone", "mobile"]) {
            var phone = _.findWhere(object.phones, {kind: kind});

            if (phone) {
                return (
                    <div className="CrisisLineItem">
                        <h3>
                            <Router.Link
                                to="service"
                                params={{slug: object.slug}}
                            >
                                {object.site.name} {object.name}
                            </Router.Link>
                        </h3>
                        <Phone {...phone} />
                    </div>
                );
            }
        }

        return <span />;
    }
}

export default CrisisLineItem;
