import React from "react";
import icons from "../../icons";

export const ContactDetailPhoneInline = ({number, comment, mobileView}) => {
    const text = number + (comment ? " (" + comment + ")" : "")

    return (
        <div className="contact-detail phone inline">
            {
                mobileView ? (
                    <a href={"tel:" + number}>{text}</a>
                ) : (<span>{text}</span>)
            }
        </div>
    )
}

export const ContactDetailPhone = ({number, comment, mobileView}) => {
    return (
        <div className="contact-detail phone">
            <icons.Phone/>
            <span className="main">
                {
                    mobileView ? (
                        <a href={"tel:" + number}>{number}</a>
                    ) : <span>{number}</span>
                } ({comment})
            </span>
        </div>
    )
}

export const ContactDetailWeb = ({url, linkText}) => {
    return (
        <div className="contact-detail web">
            <icons.Website className="icon"/>
            <a
                href={url}
                rel="noopener noreferer"
                target="_blank"
                className="main"
            >
                {linkText}
            </a>
        </div>
    )
}


export const states = [
    {
        title: "Victoria",
        number: {
            number: "1800 675 398",
            comment: "State coronavirus hotline",
        },
        web: [
            {
                url: "https://dhhs.vic.gov.au/coronavirus",
                // eslint-disable-next-line max-len
                linkText: "Victorian Department of Health and Human Services – Coronavirus Info",
            },
            {
                url: "https://www.dhhs.vic.gov.au/information-and-supports-public-housing-restrictions-covid-19",
                // eslint-disable-next-line max-len
                linkText: "Victorian Department of Health and Human Services – Public Housing Restrictions",
            },
        ],
        additionalContent: (mobileView) => <li>
            <div>
                If you live in a public housing estate you can access
                support from the Department of {" "}
                Health and Human Services by calling {" "}
                <ContactDetailPhoneInline
                    mobileView={mobileView}
                    number="1800 961 054"
                />
                If you need a translator call {" "}
                <ContactDetailPhoneInline
                    mobileView={mobileView}
                    number="131 450"
                />
            </div>
            <div>
                {/* eslint-disable-next-line max-len */}
                Both services are available 24 hours a day and 7 days a week.
            </div>
        </li>,
    },
    {
        title: "New South Wales",
        number: {
            number: "1800 022 222",
            comment: "Healthdirect",
        },
        web: [
            {
                url: "https://www.nsw.gov.au/covid-19",
                // eslint-disable-next-line max-len
                linkText: "NSW health coronavirus webpage",
            },
        ],
    },
    {
        title: "Queensland",
        number: {
            number: "13 43 25 84",
            // eslint-disable-next-line max-len
            comment: "13 HEALTH - health advice for Queenslanders over the phone",
        },
        web: [
            {
                url: "https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19",
                // eslint-disable-next-line max-len
                linkText: "Queensland Health coronavirus webpage",
            },
        ],
    },
    {
        title: "West Australia",
        web: [
            {
                url: "https://healthywa.wa.gov.au/coronavirus",
                linkText: "WA Department of Health coronavirus webpage",
            },
        ],
    },
    {
        title: "South Australia",
        web: [
            {
                url: "https://www.sahealth.sa.gov.au/COVID2019",
                // eslint-disable-next-line max-len
                linkText: "SA Health coronavirus webpage",
            },
        ],
    },
    {
        title: "Tasmania",
        number: {
            number: "1800 671 738",
            comment: "Tasmanian Public Health Hotline",
        },
        web: [
            {
                url: "https://www.coronavirus.tas.gov.au/",
                // eslint-disable-next-line max-len
                linkText: "Tasmanian Department of Health coronavirus webpage",
            },
        ],
    },
    {
        title: "Australian Capital Territory",
        web: [
            {
                url: "https://www.covid19.act.gov.au/",
                // eslint-disable-next-line max-len
                linkText: "ACT Health coronavirus webpage",
            },
        ],
    },
    {
        title: "Northern Territory",
        number: {
            number: "1800 008 002",
            // eslint-disable-next-line max-len
            comment: <span>NT Hotline <strong>for people who need to arrange testing only</strong></span>,
        },
        web: [
            {
                url: "https://coronavirus.nt.gov.au/",
                // eslint-disable-next-line max-len
                linkText: "NT Department of Health coronavirus webpage",
            },
        ],
    },
]
