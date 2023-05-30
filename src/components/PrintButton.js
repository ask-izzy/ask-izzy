/* @flow */

import type {Node as ReactNode} from "react"
import React, {useState} from "react";
import ReactToPrint from "react-to-print";

import Button from "./base/Button";

type Props = {
    ComponentToPrint?: ReactNode,
}

function PrintButton({
    ComponentToPrint = <></>,
}: Props): ReactNode {

    let printableComponentRef = React.useRef();
    const PrintableComponent = React.forwardRef((props, ref) => (
        <div
            className="printable-area"
            ref={ref}
            aria-hidden="true"
        >
            {ComponentToPrint}
        </div>
    ));

    return <div className="PrintButton">
        <ReactToPrint
            trigger={() =>
                <Button
                    className="print-component-button"
                    analyticsEvent={{
                        event: "Action Triggered - Share Services Opened",
                        eventAction: "Share services opened",
                        eventLabel: null,
                    }}
                >
                Print
                </Button>}
            content={() => printableComponentRef.current}
        />
        <PrintableComponent ref={printableComponentRef} />
    </div>
}

export default PrintButton
