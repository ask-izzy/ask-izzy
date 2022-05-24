/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import Link from "@/src/components/base/Link";
import StaticPage from "@/components/pages/StaticPage";
import MobileDetect from "@/src/components/higherorder/MobileDetect";

class BushfireReliefStaticPage extends React.Component<{ mobileView: boolean }> {
    render(): React.Node {
        const { mobileView } = this.props

        return (
            <StaticPage
                bannerName="money-help static"
                className="BushfireReliefPage"
                title="Bushfire support 2020"
                bannerPrimary="Bushfire support 2020"
                bannerSecondary={
                    "If you are in immediate danger, please call 000."
                }
            >
                <div className="separator" />
                <p>
                    The information on this page is for people affected by the
                    recent bushfires across Australia.
                </p>
                <div className="separator" />
                <h2>
                    Bushfire Support
                </h2>
                <p>
                    You can use Ask Izzy to{" "}
                    <Link to={"/search/bushfires -\"closed due to the recent bushfires\"/personalise"}>
                        find nearby bushfire support
                    </Link>. This includes information about emergency relief
                    centres, but please note that these may open and close on
                    short notice.
                </p>
                <div className="separator" />
                <h2>
                    Fire and emergency information in your state
                </h2>
                <h3>
                    <strong>NSW:</strong> Bushfire information line{" "}
                    {
                        mobileView ? (
                            <Link to="tel:1800679737">1800 679 737</Link>
                        ) : "1800 679 737"
                    } or visit{" "}
                    <Link
                        to="https://www.rfs.nsw.gov.au"
                    >
                        www.rfs.nsw.gov.au
                    </Link>
                </h3>
                <h3>
                    <strong>Victoria:</strong> VicEmergency hotline{" "}
                    {
                        mobileView ? (
                            <Link to="tel:1800226226">1800 226 226</Link>
                        ) : "1800 226 226"
                    } or visit{" "}
                    <Link
                        to="https://www.emergency.vic.gov.au"
                    >
                        emergency.vic.gov.au
                    </Link>
                </h3>
                <h3>
                    <strong>Queensland:</strong> Rural Fire Service{" "}
                    <Link
                        to="https://www.ruralfire.qld.gov.au"
                    >
                        www.ruralfire.qld.gov.au
                    </Link>
                </h3>
                <h3>
                    <strong>Western Australia:</strong> Emergency WA{" "}
                    <Link
                        to="https://www.emergency.wa.gov.au"
                    >
                        emergency.wa.gov.au
                    </Link>
                </h3>
                <h3>
                    <strong>South Australia:</strong> Bushfire information
                    hotline{" "}
                    {
                        mobileView ? (
                            <Link to="tel:1800362361">1800 362 361</Link>
                        ) : "1800 362 361"
                    } or visit South Australian Country Fire Service{" "}
                    <Link
                        to="https://www.cfs.sa.gov.au"
                    >
                        www.cfs.sa.gov.au
                    </Link>
                </h3>
                <h3>
                    <strong>Tasmania:</strong> Tasmanian fire service{" "}
                    <Link
                        to="http://www.fire.tas.gov.au"
                    >
                        www.fire.tas.gov.au
                    </Link>
                </h3>
                <h3>
                    <strong>ACT:</strong> ACT Emergency Services Agency{" "}
                    <Link
                        to="https://esa.act.gov.au/fire-rescue"
                    >
                        esa.act.gov.au/fire-rescue
                    </Link>
                </h3>
                <h3>
                    <strong>Northern Territory:</strong> NT Police, Fire &amp;
                    Emergency services{" "}
                    <Link
                        to={
                            "https://www.pfes.nt.gov.au/fire-and-rescue-service"
                        }
                    >
                        www.pfes.nt.gov.au/fire-and-rescue-service
                    </Link>
                </h3>
                <div className="separator" />
                <h2>
                    Disaster recovery support
                </h2>
                <p>
                    Recovery support is available for people directly affected
                    by bushfires. See the{" "}
                    <Link
                        to="https://www.humanservices.gov.au/individuals/help-emergency/bushfires"
                        rel="noreferer noopener"
                    >
                        Department of Human Services
                    </Link>
                    {" "}for available support in your state.
                </p>
                <div className="separator" />
                <h2>
                    If you want to help
                </h2>
                <h3>
                    <strong>Updating service information</strong>
                </h3>
                <p>
                    Ask Izzy has over 360,000 services listed, and we’d love
                    your help at making sure they’re up to date. If you have
                    information about a service in our directory that is closed
                    or has altered information, please let us know by completing
                    {" "}
                    <Link
                        to="https://www.surveygizmo.com/s3/5391212/Ask-Izzy-service-update-form"
                        ref="noopener noreferer"
                    >
                        this form
                    </Link>.
                </p>
                <h3>
                    <strong>Donating money</strong>
                </h3>
                <p>
                    For those with money to give, the{" "}
                    <Link
                        to="https://www.redcross.org.au/campaigns/disaster-relief-and-recovery-donate"
                    >
                        Australian Red Cross
                    </Link> and state-based fire authorities will gratefully accept
                    your donations.
                </p>
            </StaticPage>
        );
    }
}

export default (MobileDetect(BushfireReliefStaticPage): any)
