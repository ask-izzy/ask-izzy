/* @flow */

import * as React from "react";
import icons from "../../icons";
import {ContactDetailPhone, ContactDetailWeb} from "./Covid19Service";

type Props = {
  title: string,
  mobileView?: boolean,
  number?: Object,
  web?: Object,
  additionalContent?: any
};

// eslint-disable-next-line max-len
function Covid19Card({title, mobileView, number, web, additionalContent}: Props): React.Node {

    return (
        <details>
            <summary>
                <div> {/* wrapper needed for safari flex bug https://bugs.webkit.org/show_bug.cgi?id=190065 */}
                    <h3>{title}</h3>
                    <icons.Chevron/>
                </div>
            </summary>
            <ul>
                {number ? <li>
                    <ContactDetailPhone
                        mobileView={mobileView}
                        number={number?.number}
                        comment={number?.comment}
                    />
                </li> : null}
                {web && web.length ? web.map(webObj => <li key={webObj.url}>
                    <ContactDetailWeb
                        url={webObj.url}
                        linkText={webObj.linkText}
                    />
                </li>) : null}
                { additionalContent ? additionalContent(mobileView) : null}
            </ul>
        </details>
    )
}

export default Covid19Card
