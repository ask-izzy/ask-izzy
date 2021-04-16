/* @flow */

import * as React from "react";

type Props = {
    redirectUri: string,
    className: string,
    tooltip: string,
    home: boolean
}

function QuickExit({redirectUri, tooltip, className, home}: Props): React.Node {

    return <div className={className}>
        <a className="quick-exit"
            href={redirectUri}
            title={tooltip}
        >
            <div className="quick-exit">
                {home ? <span>
                        Quick Exit X
                </span> : <span>
                    <span className="longer-text">
                        Quick Exit X
                    </span>
                    <span className="shorter-text">
                        Exit ⨉
                    </span>
                </span>
                }
            </div>
        </a>
    </div>

}

QuickExit.defaultProps = {
    redirectUri: "http://www.bom.gov.au/",
    className: "button-container",
    // eslint-disable-next-line max-len
    tooltip: "To leave this website quickly, click the 'Quick Exit' button. If you are in immediate danger call 000 ( Australian emergency line), for advice about family violence  call 1800 Respect on 1800 737 732 (Helpline).",
    home: false,
};

export default QuickExit
