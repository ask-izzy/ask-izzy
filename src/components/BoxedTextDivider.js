/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import Spacer from "./Spacer";

const BoxedTextDivider = (): ReactElement<"div"> => <div className="BoxedTextDivider">
    <Spacer />
</div>;

export default BoxedTextDivider;
