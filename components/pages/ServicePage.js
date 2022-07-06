/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import {useState, useEffect} from "react";
import { useRouter } from "next/router"
import Head from "next/head"

import ServicePane from "@/src/components/ServicePane";
import Service from "@/src/iss/Service";
import {getService} from "@/src/iss/load-services"
import AppBar from "@/src/components/AppBar";
import Link from "@/src/components/base/Link";
import Loading from "@/src/icons/Loading";
import ScreenReader from "@/src/components/ScreenReader";
import {getFullPageTitle} from "@/src/utils";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "@/src/utils/page-loading"

const ServicePage = function(): React.Node {
    const [service, setService] = useState<Service | null>(null)
    const [errorGettingService, setErrorGettingService] = useState<Object>(null)

    const router = useRouter()

    useEffect(() => {
        const {serviceSlug} = router.query
        const serviceId = serviceSlug && extractId(serviceSlug)
        if (serviceId) {
            loadService(serviceId)
        }
    }, [router.query.serviceSlug])

    function extractId(slug: string): number {
        const leadingDigits = /^\d+/;
        let match = slug.match(leadingDigits);

        if (match) {
            return parseInt(match[0]);
        }
        throw new Error("Bad URL (/service/[service-id must be a number]")
    }

    async function loadService(serviceId: number): Promise<void> {
        // Unload previous service
        setService(null);

        try {
            addPageLoadDependencies(
                router.asPath,
                `requestService-${serviceId}`
            )
            setService(
                await getService(serviceId)
            );
        } catch (error) {
            setErrorGettingService(error)
        }

        closePageLoadDependencies(
            router.asPath,
            `requestService-${serviceId}`
        )
    }

    if (!service) {
        return (
            <div className="ServicePage">
                <AppBar
                    transition={false}
                />
                <div className="ServicePane">
                    <main aria-label="Loading service details">
                        {
                            errorGettingService ?
                                <div className="error">
                                    <p>
                                    Sorry, I was unable to retrieve the information for this service at this time.
                                    Please try viewing another service or contact us
                                    if the problem persists at&nbsp;
                                        <Link to={"mailto:" + process.env.NEXT_PUBLIC_SITE_EMAIL}>{process.env.NEXT_PUBLIC_SITE_EMAIL}</Link>.
                                    </p>
                                    <p>
                                        {
                                            errorGettingService.statusCode &&
                                                "(error: " + errorGettingService.statusCode + ")"
                                        }
                                    </p>
                                </div>
                                : <div className="progress">
                                    <Loading className="big" />
                                </div>
                        }
                    </main>
                </div>
            </div>
        );
    }
    return (
        <div className="ServicePage">
            <ScreenReader>
                <p aria-live="polite">
                    {service.name}
                </p>
            </ScreenReader>
            <Head>
                <title>
                    {
                        getFullPageTitle(
                            service?.name || "",
                            router
                        )
                    }
                </title>
            </Head>
            <ServicePane service={service}/>
        </div>
    );
}

ServicePage.pageTitle = "Service Details"
ServicePage.pageType = ["Service"]

export default ServicePage
