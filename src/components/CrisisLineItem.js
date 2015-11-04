/* @flow */

import React from "react";
import _ from "underscore";
import reactMixin from "react-mixin";
import { Link } from "react-router";

import Debugging from "../mixins/debugging";
import Phone from "./Phone";
import fixtures from "../../fixtures/services";
import iss from "../iss";

/*::`*/@reactMixin.decorate(Debugging)/*::`;*/
class CrisisLineItem extends React.Component {

    static displayName = "CrisisLineItem";

    static propTypes = {
        object: React.PropTypes.object.isRequired,
    };

    static sampleProps = {default: {
        object: new iss.Service(fixtures.domesticviolence),
    }};

    render(): ReactElement {
        const {
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
                        {this.renderDebugging(object._explanation)}
                    </div>
                );
            }
        }

        return <span />;
    }
}

export default CrisisLineItem;
