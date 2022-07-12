/* @flow */

import * as React from "react";
import {useState} from "react";

import ShareDirectlyOptions from "./ShareDirectlyOptions"
import SendForm from "./SendForm"
import Dialog from "@/components/base/Dialog"
import Button from "@/src/components/base/Button"
import StandardButton from "@/components/general/StandardButton"
import Input from "@/src/components/base/Input"
import EmailIcon from "@/src/icons/Email"
import PhoneIcon from "@/src/icons/Phone"
import Service from "@/src/iss/Service"

type Props = {
    onCloseRequested: () => void,
    services: Array<Service>
}

function ShareServicesDialog({
    onCloseRequested,
    services,
}: Props): React.Node {
    const [screen, setScreen] = React.useState<"Directly" | "Via Ask Izzy">("Directly")

    function renderViaAskIzzyInfoBox() {
        return (
            <div className="viaAskIzzyInfoBox">
                <h3>Why not message from Ask Izzy?</h3>
                <p>Share service in My List using Ask Izzy's messaging service.</p>
                <StandardButton onClick={() => setScreen("Via Ask Izzy")}>
                    Send via Ask Izzy
                </StandardButton>
            </div>
        )
    }

    return (
        <Dialog
            open={true}
            onClose={onCloseRequested}
        >
            {({titleProps}) => (
                <div className="ShareServicesDialog">
                    <header>
                        <h1 {...titleProps}>Share My List</h1>
                        <Button
                            onClick={onCloseRequested}
                            className="close"
                        >
                            <span>&times;</span>
                        </Button>
                    </header>
                    {screen === "Directly" && <ShareDirectlyOptions services={services} />}
                    <main>
                        {screen === "Directly" && renderViaAskIzzyInfoBox()}
                        {screen === "Via Ask Izzy" && (
                            <SendForm
                                services={services}
                                onCloseRequest={() => setScreen("Directly")}
                            />
                        )}
                    </main>
                </div>
            )}
        </Dialog>
    )

}

export default ShareServicesDialog
