/* @flow */

import React from "react";
import {Link} from "react-router";
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
        let {
            object,
        } = this.props;

        for (let kind of ["freecall", "phone", "mobile"]) {
            let phone = _.findWhere(object.phones, {kind: kind});

            if (phone) {
                return (
                    <div className="CrisisLineItem">
                        <h3>
                            <Link
                                to={`/service/${object.slug}`}
                            >
                                {object.site.name} {object.name}
                            </Link>
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
