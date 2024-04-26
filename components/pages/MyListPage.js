/* @flow */

import React, {useState} from "react";
import type {Node as ReactNode} from "react";
import { useRouter } from "next/router"

import HeaderBar from "@/src/components/HeaderBar"
import MyListResults from "@/src/components/MyListResults"
import Button from "@/src/components/base/Button"
import Loading from "@/src/icons/Loading"
import ScrollToTop from "@/src/components/ResultsListPage/ScrollToTop"
import ShareButton from "@/src/components/ShareButton"
import PrintButton from "@/src/components/PrintButton"
import classnames from "classnames";
import {MobileDetect} from "@/src/effects/MobileDetect";
import Spacer from "@/src/components/Spacer";
import useMyList from "@/hooks/useMyList"
import ClearMyListDialog from "@/src/components/ClearMyListDialog"
import BrandedFooter from "@/src/components/BrandedFooter"
import MyListPrintPage from "@/src/components/PrintComponents/MyListPrintPage"


function MyListPage(): ReactNode {
    const router = useRouter()
    const isMobile = MobileDetect(590)
    const {
        myListServices,
        clearAllMyListServices,
        isLoading,
    } = useMyList()
    const [openClearAllDialog, setOpenClearAllDialog] = useState<boolean>(false)

    function renderInformationText() {
        return (
            <div className="information-container">
                <div className="information-text">
                    <h3>How long will services stay in My List?</h3>
                    <div className="instructions">
                        Services will be kept here until you remove them or your browsing history is cleared.
                    </div>
                    <div className="instructions">
                        Why not send the services on this list to
                        yourself now?
                    </div>
                    <ShareButton
                        hasTextDescription={true}
                        services={myListServices}
                        type="text"
                    />
                </div>

            </div>

        )
    }

    function renderResults() {
        if (isLoading) {
            return (
                <div className="progress">
                    <Loading className="big" />
                </div>
            )
        } else if (myListServices.length == 0) {
            return (
                <div className="empty-list-container">
                    <h3>
                        Your list is empty
                    </h3>
                    <div className="instructions">
                        Search Ask Izzy to add services here.
                    </div>
                    <Button onClick={() => router.push("/")}
                        className="back-to-home"
                    >
                        Search for services
                    </Button >
                </div>
            )
        } else {
            return (
                <div className="my-list-results-container">
                    <MyListResults
                        results={myListServices}
                        resultsLoading={isLoading}
                        travelTimesStatus={"loaded"}
                    >
                        {renderInformationText()}
                    </MyListResults>
                </div>
            )
        }

    }
    function renderTopButtonContainer() {
        return (
            <div className={classnames("top-button-container", {"web": !isMobile})}>
                <div className={classnames("count-container", {"mobile": isMobile})}>
                    {
                        `${myListServices.length} service${myListServices.length > 1 ? "s" : ""} in your list`
                    }
                    {isMobile &&
                        <div className="other-mobile-features-container">
                            <ShareButton
                                hasTextDescription={false}
                                services={myListServices}
                                type="secondary"
                            />
                            <PrintButton
                                hasTextDescription={false}
                                ComponentToPrint={
                                    <MyListPrintPage
                                        services={myListServices}
                                    />
                                }
                            />
                        </div>

                    }
                </div>

                {isMobile && <Spacer />}
                <div className={classnames("clear-all-container", {"mobile": isMobile})}>
                    <Button className={classnames("clear-all", {"mobile": isMobile})}
                        onClick={() => {
                            setOpenClearAllDialog(true)
                        }}
                    >
                        Clear all
                    </Button>
                    {!isMobile &&
                        <ShareButton
                            hasTextDescription={true}
                            services={myListServices}
                        />
                    }
                    {!isMobile &&
                        <PrintButton
                            ComponentToPrint={
                                <MyListPrintPage
                                    services={myListServices}
                                />
                            }
                        />
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="MyListPage">
            <div>
                <HeaderBar
                    className="serviceDetailsHeader"
                    primaryText={"My List"}
                    secondaryText={"Add services to this page to create a list you can share"}
                    infoText={"Services on this page will only remain here temporarily"}
                    bannerName="hands-and-house"
                />
                {myListServices.length !== 0 && renderTopButtonContainer()}

            </div>
            {renderResults()}
            <ScrollToTop label="To top"/>
            <BrandedFooter />
            {
                openClearAllDialog &&
                <ClearMyListDialog
                    onCloseRequested={() => setOpenClearAllDialog(false)}
                    onClearMyList={() => {
                        clearAllMyListServices()
                        setOpenClearAllDialog(false)
                    }}
                />
            }
        </div>
    );
}

export default MyListPage
