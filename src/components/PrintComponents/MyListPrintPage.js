/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import { generate } from "lean-qr";
// $FlowIgnore TypeScript when???
import { toSvgDataURL } from "lean-qr/extras/svg";

import Address from "@/src/components/Address";
import PhoneSolid from "@/src/icons/PhoneSolid";
import AskIzzyGreyScale from "@/src/icons/AskIzzyGreyScale";
import Spacer from "@/src/components/Spacer";

type Props = {
    services: Array<any>,
}
export default function MyListPrintPage({
    services,
}: Props): ReactElement<"div"> {
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

    return (
        <div
            className="MyListPrintPage"
        >
            <div className="my-list-print-header">
                <AskIzzyGreyScale />
                <div className="date-container">
                    {(new Date()).toLocaleDateString()}
                </div>
            </div>
            <div>
                The services below are from <b>www.askizzy.org.au</b>
            </div>
            <ul className="my-list-print-list">
                {services.map((service, index) => {
                    return (
                        <li
                            className="my-list-print-list-item"
                            key={index}
                        >
                            <div className="my-list-print-service-name">
                                <b>{service.name}</b>
                            </div>
                            <div className="my-list-print-service-site">
                                {service.site.name}
                            </div>
                            {
                                service.ndis_approved &&
                                 <div className="my-list-print-service-ndis">
                                    Part of the NDIS
                                 </div>
                            }
                            <div className="my-list-print-service-description">
                                {service.shortDescription}
                            </div>
                            <Address
                                location={service.location}
                                singleLineAddress={true}
                                hasSolidIcon={true}
                            />
                            <div className="my-list-print-service-phone">
                                {service.Phones().map((phone, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="my-list-print-phone-container"
                                        >
                                            <PhoneSolid />
                                            <span>
                                                {phone.number}
                                                {
                                                    phone.comment &&
                                                    <span>
                                                        {" "}
                                                        {`(${phone.comment})`}
                                                    </span>
                                                }
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className="need-an-interpreter">
                <b>Don't speak English and need an interpreter?</b>
                <div>TIS National may help, call 131 450</div>
            </div>
            <Spacer />
            <div className="my-list-print-footer">
                <div className="my-list-print-about">
                    <div className="my-list-print-about-title">About Ask Izzy</div>

                    <div className="my-list-print-about-description">
                        Ask Izzy is a free online directory of support services when you need help with housing,
                        a meal, money help, family violence support, counselling and much more.
                    </div>
                </div>
                <div className="my-list-print-qr">
                    <div className="my-list-print-qr-description">
                        Learn about Ask Izzy
                        in other languages
                    </div>
                    <img
                        src={qrCodeDataURL}
                        className="qr-code"
                    />
                </div>
            </div>
        </div>
    )
}