/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import Spacer from "./Spacer";

export default (): ReactElement<"div"> =>
    <div className="BoxedTextDivider">
        <Spacer />
    </div>
;
