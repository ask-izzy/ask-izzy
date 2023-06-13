import React, {ReactNode} from "react";

import ShareDirectlyOptions from "@/components/ShareServicesDialog/ShareDirectlyOptions.js"
import SendForm from "@/components/ShareServicesDialog/SendForm.js"
import Dialog from "@/components/base/Dialog.js"
import Button from "@/src/components/base/Button.js"
import StandardButton from "@/components/general/StandardButton.js"
import Service from "@/src/iss/Service.js"
import storage from "@/src/storage.js";
import Send from "@/src/icons/Send.js"

type Props = {
    onCloseRequested: () => void,
    services: Array<Service>,
}

type ScreenNames = "Directly" | "Via Ask Izzy" | "No services"

function ShareServicesDialog({
    onCloseRequested,
    services,
}: Props) {
    const [screenName, setScreenName] = React.useState<ScreenNames>(
        services.length ? "Directly" : "No services",
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
                            aria-label="Close dialog"
                        >
                            <span>&times;</span>
                        </Button>
                    </header>
                    {renderScreen(screenName, {setScreenName, services, onCloseRequested})}
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

function renderDirectlyScreen({services, onCloseRequested, setScreenName}) {
    const userIsServiceWorker = storage.getItem("who-is-looking-for-help") === "User Worker"

    let viaIzzyDescription
    if (userIsServiceWorker) {
        viaIzzyDescription = `Share service details using Ask Izzy's messaging service.`
    } else {
        viaIzzyDescription = `No data or credit? Share services free, via SMS or email directly from Ask Izzy.`
    }

    return <>
        <ShareDirectlyOptions services={services}
            onClose={onCloseRequested}
        />
        <div className="highlighted-box">
            <div className="viaAskIzzyInfoBox">
                <h3>Why not message from Ask Izzy?</h3>
                <p>
                    {viaIzzyDescription}
                </p>
                <StandardButton
                    className="send-via-askizzy-container"
                    onClick={() => setScreenName("Via Ask Izzy")}
                    analyticsEvent={{
                        event: "Action Triggered - Opened Share Services Via Ask Izzy",
                        eventAction: "Opened share services via Ask Izzy",
                        eventLabel: null,
                    }}
                >
                    <Send/>
                    Send via Ask Izzy
                </StandardButton>
            </div>
        </div>
    </>
}

function renderViaAskIzzyScreen({services, onCloseRequested}): ReactNode {
    return <>
        <div className="highlighted-box">
            <SendForm
                services={services}
                onCloseRequest={onCloseRequested}
            />
        </div>
    </>
}

function renderNoServicesScreen(): ReactNode {
    return <>
        <div className="info">
            No services currently selected. To share several services first click the plus button next to the services
            you&apos;d like to share.
        </div>
    </>
}

export default ShareServicesDialog
