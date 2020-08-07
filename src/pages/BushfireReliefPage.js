/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";
import MobileDetect from "../components/higherorder/MobileDetect";

class BushfireReliefStaticPage extends React.Component<{ mobileView: boolean }> {
    render(): React.Node {
        const { mobileView } = this.props

        return (
            <StaticPage
                title="Bushfire support"
                bannerName="money-help static"
                className="BushfireReliefPage"
                bannerPrimary="Bushfire support 2020"
                bannerSecondary={
                    "If you are in immediate danger, please call 000"
                }
                history={this.props.history}
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
                    <Link to="/search/bushfires -(closed due to the recent bushfires)/personalise">
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
                            <a href="tel:1800679737">1800 679 737</a>
                        ) : "1800 679 737"
                    } or visit{" "}
                    <a
                        href="https://www.rfs.nsw.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        www.rfs.nsw.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>Victoria:</strong> VicEmergency hotline{" "}
                    {
                        mobileView ? (
                            <a href="tel:1800226226">1800 226 226</a>
                        ) : "1800 226 226"
                    } or visit{" "}
                    <a
                        href="https://www.emergency.vic.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        emergency.vic.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>Queensland:</strong> Rural Fire Service{" "}
                    <a
                        href="https://www.ruralfire.qld.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        www.ruralfire.qld.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>Western Australia:</strong> Emergency WA{" "}
                    <a
                        href="https://www.emergency.wa.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        emergency.wa.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>South Australia:</strong> Bushfire information
                    hotline{" "}
                    {
                        mobileView ? (
                            <a href="tel:1800362361">1800 362 361</a>
                        ) : "1800 362 361"
                    } or visit South Australian Country Fire Service{" "}
                    <a
                        href="https://www.cfs.sa.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        www.cfs.sa.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>Tasmania:</strong> Tasmanian fire service{" "}
                    <a
                        href="http://www.fire.tas.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        www.fire.tas.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>ACT:</strong> ACT Emergency Services Agency{" "}
                    <a
                        href="https://esa.act.gov.au/fire-rescue"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        esa.act.gov.au/fire-rescue
                    </a>
                </h3>
                <h3>
                    <strong>Northern Territory:</strong> NT Police, Fire &amp;
                    Emergency services{" "}
                    <a
                        href={
                            "https://www.pfes.nt.gov.au/fire-and-rescue-service"
                        }
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        www.pfes.nt.gov.au/fire-and-rescue-service
                    </a>
                </h3>
                <div className="separator" />
                <h2>
                    Disaster recovery support
                </h2>
                <p>
                    Recovery support is available for people directly affected
                    by bushfires. See the{" "}
                    <a
                        href="https://www.humanservices.gov.au/individuals/help-emergency/bushfires"
                        target="_blank"
                        rel="noreferer noopener"
                    >
                        Department of Human Services
                    </a>
                    {" "}for available support in your state.
                </p>
                <div className="separator" />
                <h2>
                    If you want to help
                </h2>
                <p>
                    <strong>Updating service information</strong>
                </p>
                <p>
                    Ask Izzy has over 360,000 services listed, and we’d love
                    your help at making sure they’re up to date. If you have
                    information about a service in our directory that is closed
                    or has altered information, please let us know by completing
                    {" "}
                    <a
                        href="https://www.surveygizmo.com/s3/5391212/Ask-Izzy-service-update-form"
                        target="_blank"
                        ref="noopener noreferer"
                    >
                        this form
                    </a>.
                </p>
                <p>
                    <strong>Donating money</strong>
                </p>
                <p>
                    For those with money to give, the{" "}
                    <a
                        href="https://www.redcross.org.au/campaigns/disaster-relief-and-recovery-donate"
                        target="_blank"
                        rel="noopener noreferer"
                    >
                        Australian Red Cross
                    </a> and state-based fire authorities will gratefully accept
                    your donations.
                </p>
            </StaticPage>
        );
    }
}

export default MobileDetect(BushfireReliefStaticPage)
