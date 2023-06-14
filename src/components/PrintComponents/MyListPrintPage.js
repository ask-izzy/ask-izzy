/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import moment from "moment"

import Address from "@/src/components/Address";
import PhoneSolid from "@/src/icons/PhoneSolid";
import AskIzzyGreyScale from "@/src/icons/AskIzzyGreyScale";
import UsingAskIzzyQrCode from "@/src/icons/UsingAskIzzyQrCode";
import Spacer from "@/src/components/Spacer";

type Props = {
    services: Array<any>,
}
export default function MyListPrintPage({
    services,
}: Props): ReactElement<"div"> {
    const date = moment();
    const formattedDate = date.format("DD/MM/YYYY");

    return (
        <div
            className="MyListPrintPage"
        >
            <div className="my-list-print-header">
                <AskIzzyGreyScale />
                <div className="date-container">
                    {formattedDate}
                </div>
            </div>
            <div>
                The services bellow are from <b>www.askizzy.org.au</b>
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
                    <div className="my-list-print-about-title"><b>About Ask Izzy</b></div>

                    <div className="my-list-print-about-description">
                        Ask Izzy is a free online directory of support services when you need help with housing,
                        a meal, money help, family violence support, counselling and much more.
                    </div>
                </div>
                <div className="my-list-print-qr">
                    <div className="my-list-print-qr-description">
                        <div>
                            Learn about Ask Izzy
                        </div>
                        <div>
                            in other languages
                        </div>
                    </div>
                    <UsingAskIzzyQrCode />
                </div>
            </div>
        </div>
    )
}
