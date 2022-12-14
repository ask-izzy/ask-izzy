import getServiceFixture from "@/fixtures/factories/Service"
import Service from "@/src/iss/Service"
import * as serviceProps from "@/fixtures/servicesProps"

export const phoneableService: Service = getServiceFixture(
    serviceProps.phoneableServiceProps,
)

export const housingService: Service = getServiceFixture(
    serviceProps.housingServiceProps,
)

export const housingServiceSibling: Service = getServiceFixture(
    serviceProps.housingServiceSiblingProps,
)

export const youthSupportNetService: Service = getServiceFixture(
    serviceProps.youthSupportNetServiceProps,
)

export const susansHouseService: Service = getServiceFixture(
    serviceProps.susansHouseServiceProps,
)

export const ixaService: Service = getServiceFixture(
    serviceProps.ixaServiceProps,
)

export const legalService: Service = getServiceFixture(
    serviceProps.legalServiceProps,
)

export const domesticViolenceService: Service = getServiceFixture(
    serviceProps.domesticViolenceServiceProps,
)

export const unhelpfulService: Service = getServiceFixture(
    serviceProps.domesticViolenceServiceProps,
)
