/* @flow */

import React from "react";
import _ from "underscore";
import { Link } from "react-router";

import Phone from "./Phone";
import fixtures from "../../fixtures/services";
import iss from "../iss";
import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";

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
                                {object.site.name}
                            </Link>
                        </h3>
                        <Phone {...phone} />
                        <DebugContainer>
                            <DebugQueryScore expl={object._explanation} />
                        </DebugContainer>
                    </div>
                );
            }
        }

        return <span />;
    }
}

export default CrisisLineItem;
