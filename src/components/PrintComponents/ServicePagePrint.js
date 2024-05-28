/* $FlowIgnore */

import type {Element as ReactElement} from "React";
import React from "react";
import { generate } from "lean-qr";
import { toSvgDataURL } from "lean-qr/extras/svg";
import AskIzzyGreyScale from "@/src/icons/AskIzzyGreyScale";
import Address from "@/src/components/Address";
import PhoneSolid from "@/src/icons/PhoneSolid";
import Spacer from "@/src/components/Spacer";
import Email from "@/src/components/Email";
import Web from "@/src/components/Web";
import BoxedText from "@/src/components/BoxedText";
import Service from "@/src/iss/Service.js";
import Eligibility from "../Eligibility";
import Cost from "../CostField";
import Accessibility from "../Accessibility";
import OpeningTimesList from "@/src/components/OpeningTimesList";

type Props = {
    service: Service,
    url: string,
}

export default function ServicePagePrint({service}: Props): ReactElement<"div"> {
    const qrCodeDataURL = toSvgDataURL(
        generate(`${process.env.SITE_BASE_URL}/using-ask-izzy?p=p`),
        {
            on: "black",
            off: "transparent",
            padX: 4,
            padY: 4,
            xmlDeclaration: false,
            scale: 1,
        }
    );
    const renderEmail = service.emails.length > 0 && (
        <>
            <Spacer />
            <div className="email-container">
                {service.emails.map((emailObject, index) => (
                    <Email
                        key={index}
                        email={emailObject.email}
                    />
                ))}
            </div>
        </>
    )

    return (
        <div className="ServicePagePrint">
            <div className="Top-container">
                {/* Ask Izzy Header */}
                <div className="service-page-print-header">
                    <AskIzzyGreyScale />
                    <div className="date-container">
                        {(new Date()).toLocaleDateString()}
                    </div>
                </div>

                {/* Small Caption that goes under logo */}
                <div className="service-info-caption">
                The information for this service was taken from <b>www.askizzy.org.au</b>
                </div>

                <div className="Service-Containers">
                    {/* Service Info */}
                    <div className="Service-Info">
                        <b>{console.log(service)}</b>
                        <div className="service-page-print-service-name">
                            <b>{service.name}</b>
                        </div>
                        <div className="service-page-print-service-site">
                            {service.site.name}
                        </div>
                        {service.ndis_approved &&
                        <div className="service-page-print-service-ndis">
                            Part of the NDIS
                        </div>
                        }

                        {/* Header for "What you can get here" */}
                        <div className="service-page-print-service-provisions">
                            {service._serviceProvisions && service._serviceProvisions.length > 0 ? (
                            <>
                                <h2>What you can get here</h2>
                                <ul>
                                    {service.serviceProvisions.map((provision, index) => (
                                        <li key={index}>{provision}</li>
                                    ))}
                                </ul>
                            </>
                            ) : (
                                <p>{service.description}</p>
                            )}
                        </div>

                        <Eligibility
                            catchment={service.catchment}
                            eligibility_info={service.eligibility_info}
                            ineligibility_info={service.ineligibility_info}
                            referral_info={service.referral_info}
                            special_requirements={service.special_requirements}
                        />
                    </div>

                    {/* ServicePane Section */}
                    <div className="ServicePane-Info">
                        <BoxedText>

                            {/* Opening Times*/}
                            <OpeningTimesList
                                service={service}
                                withIcon={true}
                                withSpacer={false}
                            />

                            {/* ADDRESS */}
                            {service.location && (
                            <>
                                <Spacer />
                                <Address
                                    location={service.location}
                                    singleLineAddress={false}
                                    hasSolidIcon={true}
                                />
                            </>
                            )}
                            {/* PHONE */}
                             <>
                            {service.phones.length > 0 && (
                                <>
                                    <Spacer />
                                    <div className="service-page-print-phone">
                                        {Array.from(new Set(service.phones
                                            .filter(phone => phone.kind !== "fax") // Exclude fax numbers
                                            .map(phone => phone.number))
                                        ).map((phoneNumber, index) => {
                                            const comments = service.phones
                                                .filter(phone => phone.number === phoneNumber && phone.kind !== "fax")
                                                .map(phone => phone.comment);
                                            return (
                                                <div key={index}
                                                    className="my-service-page-phone-container"
                                                >
                                                    <PhoneSolid className="icon" />
                                                    <span className="text">
                                                        {phoneNumber}
                                                        {comments.length > 0 && (
                                                            <span>{" "}{`(${comments.join(", ")})`}</span>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </>

                             {/* WEB LINK */}
                             {service.web && (
                            <>
                                <Spacer />
                                <div className="web-container">
                                    <Web url={service.web} />
                                </div>
                            </>
                             )}

                             {renderEmail}

                             {/* LANGUAGES */}
                             {service.languages && service.languages.length > 0 && (
                                <>
                                <Spacer />
                                    <div className="service-page-print-languages">
                                        Languages spoken here: {service.languages.join(", ")}
                                    </div>
                                </>
                             )}

                             {/* Accessibility */}
                             <Accessibility
                                 service={service}
                                 withSpacer={true}
                             />

                        </BoxedText>
                        <Cost cost={service.cost}
                            hideContentPreview={true}
                        />
                    </div>
                </div>
            </div>

            <div className="Bottom-container">
                <Spacer />
                <div className="page-print-footer">
                    <div className="top-section">
                        {/* Don't speak English section */}
                        <div className="need-an-interpreter">
                            <b>Don't speak English and need an interpreter?</b>
                            <div>TIS National may help, call 131 450</div>
                        </div>
                        {/* ABOUT ASK IZZY */}
                        <h2 className="service-page-print-about-title">About Ask Izzy</h2>
                        <div className="service-page-print-about-description">
                                Ask Izzy is a free online directory of support services when you need help with housing,
                                a meal, money help, family violence support, counselling and much more.
                        </div>
                    </div>
                    {/* QR CODE */}
                    <div className="service-page-print-qr">
                        <div className="service-page-print-qr-title">
                                Learn about Ask Izzy in other languages
                        </div>
                        <img src={qrCodeDataURL}
                            className="qr-code"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
