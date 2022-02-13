/* @flow */

import React from "react";
import type {Node as ReactNode} from "react"

import Service from "../iss/Service";
import Spacer from "./Spacer";

type Props = {
    object: Service,
}

export default function ImportantInformation({
    object,
}: Props): ReactNode {

    return (
        <div>
            {
                object.intake_point ?
                    <div className="Feedback">
                        <Spacer />
                        <b>Important Information</b>
                        {object.intake_point}
                    </div>
                    : <div />
            }
        </div>
    );
}
