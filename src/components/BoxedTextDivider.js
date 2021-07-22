/* @flow */

import type {Element} from "React";
import React from "react";
import Spacer from "./Spacer";

export default (): Element<"div"> =>
    <div className="BoxedTextDivider">
        <Spacer />
    </div>
;
