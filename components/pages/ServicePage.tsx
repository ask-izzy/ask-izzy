/* eslint-disable max-len */
import React, {useState, useEffect} from "react";
import { useRouter } from "next/router"
import Head from "next/head"

import ServicePane from "@/src/components/ServicePane.js";
import Service from "@/src/iss/Service.js";
import {getService} from "@/src/iss/load-services.js"
import AppBar from "@/src/components/AppBar.js";
import Link from "@/src/components/base/Link.js";
import Loading from "@/src/icons/Loading.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import {getFullPageTitle} from "@/src/utils/index.js";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "@/src/utils/page-loading.js"

const ServicePage = function() {
    const [service, setService] = useState<Service | null>(null)
    const [errorGettingService, setErrorGettingService] = useState<Record<string, any> | null>(null)

    const router = useRouter()

    useEffect(() => {
        const {serviceSlug} = router.query
        const serviceId = serviceSlug && extractId(serviceSlug as string)
        if (serviceId) {
            loadService(serviceId)
        }
    }, [router.query.serviceSlug])

    function extractId(slug: string): number {
        const leadingDigits = /^\d+/;
        const match = slug.match(leadingDigits);

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
                `requestService-${serviceId}`,
            )
            setService(
                await getService(serviceId),
            );
        } catch (error) {
            setErrorGettingService(error)
        }

        closePageLoadDependencies(
            router.asPath,
            `requestService-${serviceId}`,
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
                                        <Link
                                            to={"mailto:" + process.env.NEXT_PUBLIC_SITE_EMAIL}
                                        >
                                            {process.env.NEXT_PUBLIC_SITE_EMAIL}
                                        </Link>.
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
                            router,
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
