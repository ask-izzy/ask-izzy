/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import PropTypes from "proptypes";

import Link from "./base/Link";
import PhoneButton from "./PhoneButton";
import fixtures from "../../fixtures/services";
import iss from "../iss";
import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";
import Collapser from "./general/Collapser";
import OpeningTimes from "./OpeningTimes";

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
    object: iss.Service,
    resultNumber: number
}

class CrisisLineItem extends React.Component<Props, void> {
    static displayName: ?string = "CrisisLineItem";

    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    static sampleProps: any = {default: {
        object: new iss.Service(fixtures.domesticviolence),
    }};

    render(): ReactElement<"div"> | ReactElement<"span"> {
        const {
            object,
        } = this.props;
        const phone = object.Phones()[0];

        if (phone) {
            return (
                <div className="CrisisLineItem">
                    <div>
                        <h3>
                            <Link
                                to={`/service/${object.slug}`}
                                analyticsEvent={{
                                    event: `Link Followed - Service Result`,
                                    eventAction: "Service result",
                                    eventLabel: `Crisis line - number ${this.props.resultNumber}`,
                                }}
                            >
                                {object.site.name}
                            </Link>
                        </h3>
                        <OpeningTimes
                            className="opening_hours"
                            object={object.open}
                            compact={true}
                        />
                        {
                            crisisDescriptions[object.id] &&
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
                                {crisisDescriptions[object.id](object)}
                            </Collapser>
                        }
                        <DebugServiceRecord object={object} />
                        {object._explanation &&
                            <DebugContainer message="Query score">
                                <DebugQueryScore expl={object._explanation} />
                            </DebugContainer>
                        }
                    </div>
                    <PhoneButton
                        {...phone}
                        crisis={true}
                    />
                </div>
            );
        }

        return <span />;
    }
}

export default CrisisLineItem;
