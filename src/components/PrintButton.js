/* @flow */

import type {Node as ReactNode} from "react"
import React from "react";

import { useReactToPrint } from "react-to-print";

import Button from "../../components/general/StandardButton"
import Print from "@/src/icons/Print";

type Props = {
    ComponentToPrint?: ReactNode,
    hasTextDescription?: boolean,
    type?:"primary" | "secondary" | "text" | "action",
    isInServicePane?: boolean,
}

function PrintButton({
    ComponentToPrint = <></>,
    hasTextDescription = true,
    type = "secondary",
    isInServicePane = false,
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
    const handlePrint = useReactToPrint({
        content: () => printableComponentRef.current,
    });

    return <div className="PrintButton">
        <Button
            className="print-component-button"
            onClick={handlePrint}
            analyticsEvent={{
                event: "Action Triggered - Page Printed",
                eventAction: "Page printed",
                eventLabel: null,
            }}
        >
            <div className="main-container">
                <Print />
                {
                    hasTextDescription &&
                                    <span>Print Friendly</span>
                }
            </div>
        </Button>
        <PrintableComponent ref={printableComponentRef} />
    </div>
}

export default PrintButton;
