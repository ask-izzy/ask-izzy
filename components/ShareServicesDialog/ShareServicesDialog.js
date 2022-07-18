/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";

import ShareDirectlyOptions from "./ShareDirectlyOptions"
import SendForm from "./SendForm"
import Dialog from "@/components/base/Dialog"
import Button from "@/src/components/base/Button"
import StandardButton from "@/components/general/StandardButton"
import Service from "@/src/iss/Service"
import storage from "@/src/storage";

type Props = {
    onCloseRequested: () => void,
    services: Array<Service>,
}

type ScreenNames = "Directly" | "Via Ask Izzy" | "No services"

function ShareServicesDialog({
    onCloseRequested,
    services,
}: Props): React.Node {
    const [screenName, setScreenName] = React.useState<ScreenNames>(
        services.length ? "Directly" : "No services"
    )

    const isSingleService = services.length === 1

    const title = isSingleService ? "Share this service" : "Share services"

    return (
        <Dialog
            open={true}
            onClose={onCloseRequested}
        >
            {({titleProps}) => (
                <div className="ShareServicesDialog">
                    <header>
                        <h1 {...titleProps}>{title}{isSingleService}</h1>
                        <Button
                            onClick={onCloseRequested}
                            className="close"
                        >
                            <span>&times;</span>
                        </Button>
                    </header>
                    {renderScreen(screenName, {setScreenName, services})}
                </div>
            )}
        </Dialog>
    )
}

function renderScreen(screenName: ScreenNames, args): ReactNode {
    if (screenName === "Directly") {
        return renderDirectlyScreen(args)
    } else if (screenName === "Via Ask Izzy") {
        return renderViaAskIzzyScreen(args)
    } else if (screenName === "No services") {
        return renderNoServicesScreen()
    } else {
        return <span>An error occurred. Try reloading</span>
    }
}

function renderDirectlyScreen({services, setScreenName}) {
    const userIsServiceWorker = storage.getItem("who-is-looking-for-help") === "User Worker"

    let viaIzzyDescription
    if (userIsServiceWorker) {
        viaIzzyDescription = `Share service details using Ask Izzy's messaging service.`
    } else {
        viaIzzyDescription = `No data or credit? Share services free, via SMS or email directly from Ask Izzy.`
    }

    return <>
        <ShareDirectlyOptions services={services} />
        <div className="highlighted-box">
            <div className="viaAskIzzyInfoBox">
                <h3>Why not message from Ask Izzy?</h3>
                <p>
                    {viaIzzyDescription}
                </p>
                <StandardButton onClick={() => setScreenName("Via Ask Izzy")}>
                    Send via Ask Izzy
                </StandardButton>
            </div>
        </div>
    </>
}

function renderViaAskIzzyScreen({services, setScreenName}): ReactNode {
    return <>
        <div className="highlighted-box">
            <SendForm
                services={services}
                onCloseRequest={() => setScreenName("Directly")}
            />
        </div>
    </>
}

function renderNoServicesScreen(): ReactNode {
    return <>
        <div className="info">
            No services currently selected. To share several services first click the plus button next to the services
            you'd like to share.
        </div>
    </>
}

export default ShareServicesDialog
