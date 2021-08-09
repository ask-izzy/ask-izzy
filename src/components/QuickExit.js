/* @flow */

import * as React from "react";
import Link from "./Link";
import classnames from "classnames";

type Props = {
    redirectUri: string,
    className: string,
    tooltip: string,
}

function QuickExit(
    {redirectUri, tooltip, className}: Props
): React.Node {

    return <div className={classnames("QuickExit", className)} >
        <Link className="link"
            to={redirectUri}
            title={tooltip}
        >
            <span>
                Quick Exit X
            </span>
        </Link>
    </div>

}

QuickExit.defaultProps = {
    redirectUri: "http://www.bom.gov.au/",
    className: "button-container",
    // eslint-disable-next-line max-len
    tooltip: "To leave this website quickly, click the 'Quick Exit' button. If you are in immediate danger call 000 ( Australian emergency line), for advice about family violence  call 1800 Respect on 1800 737 732 (Helpline).",
};

export default QuickExit
