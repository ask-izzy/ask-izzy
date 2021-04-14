import React from "react";

function QuickExit({redirectUri, tooltip, className, home}) {

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

export default QuickExit
