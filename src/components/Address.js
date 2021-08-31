/* @flow */
import type {Node as ReactNode} from "React";
import React, {useState} from "react";
import icons from "../icons";
import ScreenReader from "./ScreenReader";
import Location from "../iss/Location";
import SitesMap from "./SitesMap";
import type {Site} from "../iss";

type Props = {
    location: Location,
    site: Site
}

function Address({site, location}: Props):ReactNode {
    const [showMap, setShowMap] = useState(false);

    return (
        <div className="Address">
            <div className="location">
                <ScreenReader>
                    Address
                </ScreenReader>
                <div className="Address-wrapper">
                    <icons.Map />
                    <div>
                        <div className="street">
                            {location.streetAddressLine1()}
                        </div>
                        <div className="suburb">
                            {location.streetAddressLine2()}
                        </div>
                        {location.details &&
                            <div className="details">
                                {location.details}
                            </div>
                        }
                    </div>
                </div>
            </div>
            {location.point &&
                <div className="expandContainer">
                    {!showMap && <div className="backdrop"/>}
                    {!showMap &&
                        <button
                            className="expandButton"
                            onClick={() => setShowMap(!showMap)}
                        >
                            Expand Map
                        </button>
                    }
                    <SitesMap
                        className={!showMap ? "mapCollapsed" : undefined}
                        site={site}
                        siteLocations={{
                            [site.id.toString()]:
                            location,
                        }}
                    />
                </div>
            }
        </div>
    );

}

export default Address;
