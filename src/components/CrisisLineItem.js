/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import PropTypes from "proptypes";

import Link from "./base/Link";
import Service from "../iss/Service";
import PhoneButton from "./PhoneButton";
import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";
import Collapser from "./general/Collapser";

/* eslint-disable max-len */
const crisisDescriptions = {
    // housing VIC
    // $FlowIgnore numbers not supported as keys
    2721562: (service) => (
        <ul className="bonusCopy">
            <li>If you are homeless or at risk of homelessness, 1800 825 955 will connect you with an Initial Assessment and Planning worker</li>
            <li>This call may not be free from mobiles. If you are ringing from a mobile you can ask to be called back</li>
            <li>When you call this number during the day you will be connected to the nearest Homelessness Entry Service in your area. At other times you will be connected to an After Hours service.</li>
        </ul>
    ),
    // NSW Link2home
    // $FlowIgnore numbers not supported as keys
    1838208: (service) => (
        <ul className="bonusCopy">
            <li>If you are homeless or at risk of being homeless, call Link2home from anywhere in NSW</li>
            <li>You can speak to someone 24 hours a day, 7 days a week</li>
            <li>We will give you information or refer you to a service that can best help you resolve your homelessness issue</li>
            <li>If you need interpreter assistance, call <Link to="tel:1300652488" >1300 652 488</Link>.</li>
        </ul>
    ),
}

type Props = {
    service: Service,
    resultNumber: number
}

class CrisisLineItem extends React.Component<Props, void> {
    static displayName: ?string = "CrisisLineItem";

    static propTypes = {
        service: PropTypes.object.isRequired,
    };

    render(): ReactElement<"div"> | ReactElement<"span"> {
        const {
            service,
        } = this.props;
        const phone = service.Phones()[0];

        if (phone) {
            return (
                <div className="CrisisLineItem">
                    <h3>
                        <Link
                            to={`/service/${service.slug}`}
                            analyticsEvent={{
                                event: `Link Followed - Service Result`,
                                eventAction: "Service result",
                                eventLabel: `Crisis line - number ${this.props.resultNumber}`,
                            }}
                        >
                            {service.site.name}
                        </Link>
                    </h3>
                    <PhoneButton
                        {...phone}
                        crisis={true}
                    />
                    {
                        crisisDescriptions[service.id] &&
                        <Collapser
                            expandMessage="See information about this call"
                            collapseMessage="Hide information about this call"
                            analyticsEvent={{
                                event: `Action Triggered - Crisis Line Info`,
                                eventAction: "Show crisis line extra info",
                                eventLabel: null,
                            }}
                            hasIcon={true}
                        >
                            {crisisDescriptions[service.id](service)}
                        </Collapser>
                    }
                    <DebugServiceRecord object={service} />
                    {service._explanation &&
                        <DebugContainer message="Query score">
                            <DebugQueryScore expl={service._explanation} />
                        </DebugContainer>
                    }
                </div>
            );
        }

        return <span />;
    }
}

export default CrisisLineItem;
