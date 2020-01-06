/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import { Link } from "react-router";
import StaticPage from "./StaticPage";
import MobileDetect from "../components/higherorder/MobileDetect";

class BushfireReliefStaticPage extends React.Component<{ mobileView: boolean }> {
    render(): React.Node {
        const { mobileView } = this.props

        return (
            <StaticPage
                title="Bushfire Relief"
                bannerName="money-help static"
                className="BushfireReliefPage"
            >
                <p>
          The information on this page is for people affected by the current
          bushfires across Australia. You can use the back button to return to
          the regular Ask Izzy categories, but please be aware that some
          services may be affected by the fires.
                </p>
                <h2>
          For fire and emergency information in your state, contact:
                </h2>
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
            www.emergency.vic.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>NSW:</strong> Bushfire information hotline{" "}
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
                    <strong>South Australia:</strong> Bushfire information hotline{" "}
                    {
                        mobileView ? (
                            <a href="tel:1800362361">1800 362 361</a>
                        ) : "1800 362 361"
                    } or visit South Australian Country Fire
          Service{" "}
                    <a
                        href="https://www.cfs.sa.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
            https://www.cfs.sa.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>Tasmania:</strong> Tasmanian fire service{" "}
                    <a
                        href="http://www.fire.tas.gov.au"
                        rel="noopener noreferer"
                        target="_blank"
                    >
            http://www.fire.tas.gov.au
                    </a>
                </h3>
                <h3>
                    <strong>ACT:</strong> ACT Emergency Services Agency{" "}
                    <a
                        href="https://esa.act.gov.au/fire-rescue"
                        rel="noopener noreferer"
                        target="_blank"
                    >
            https://esa.act.gov.au/fire-rescue
                    </a>
                </h3>
                <h3 className="find-evacuation">
                    <strong>
            Find a nearby evacuation centre{" "}
                        <Link to="/search/Bushfire%20emergency/personalise">
              here
                        </Link>.
                    </strong>
                </h3>
                <h3>
                    <strong>
            If you want to help
                    </strong>
                </h3>
                <p>
                    <strong>Updating service information</strong>
                </p>
                <p>
          Ask Izzy has over 360,000 services listed, and we’d love your help at
          making sure they’re up to date. If you have information about a
          service in our directory that is closed or has altered information,
          please let us know by completing this form.
                </p>
            </StaticPage>
        );
    }
}

export default MobileDetect(BushfireReliefStaticPage)
