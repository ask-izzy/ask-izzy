/* @flow */

type Alert = {|
    id: number,
    attributes: {|
        title: string,
        body: string,
        createdAt: string,
        updatedAt: string,
        alertLevel: "warn" | "info",
        states: {|
            data: Array<{|
                attributes: {|
                    Name: string,
                |}
            |}>
        |},
        screenLocation: "homePage" | "resultsPage" | "servicePage",
        defaultToOpen: boolean,
    |},
|}

export default (
    parent: Object, args: Object, context: Object, info: Object
): {data: typeof allAlerts} => {
    const results = allAlerts.filter(alert => {
        if (
            info.variableValues?.screenLocation &&
            info.variableValues?.screenLocation !== alert.attributes?.screenLocation
        ) {
            return false
        }
        if (info.variableValues?.state) {
            const statesMatchResult = info.variableValues?.state.some(
                queryState => alert.attributes?.states?.data?.some(
                    state => queryState === state.attributes?.Name
                )
            ) || alert.attributes?.states?.data?.length === 0
            if (!statesMatchResult) {
                return false
            }
        }
        return true
    })
    return {data: results}
}

export const resultsPageVicAndQldWarnAlert: Alert = {
    id: 1,
    attributes: {
        title: "A vic and qld specific alert",
        body: "",
        createdAt: "2021-05-25T06:30:07.431Z",
        updatedAt: "2021-05-25T06:30:07.431Z",
        alertLevel: "warn",
        states: {
            data: [
                { attributes: { Name: "VIC" } },
                { attributes: { Name: "QLD" } },
            ],
        },
        screenLocation: "resultsPage",
        defaultToOpen: false,
    },
}
export const covidServicesAffectedAlert: Alert = {
    id: 2,
    attributes: {
        title: "COVID19 affecting services",
        body: "Services listed here may not be operating or limited. Contact " +
            "services directly for up-to-date information.\n\n[Get COVID19 " +
            "help and information near you.](/covid-19-support)",
        createdAt: "2021-05-25T12:19:33.039Z",
        updatedAt: "2021-05-25T12:19:33.039Z",
        alertLevel: "warn",
        states: {
            data: [],
        },
        screenLocation: "resultsPage",
        defaultToOpen: false,
    },
}
export const covidInfoAlert: Alert = {
    id: 3,
    attributes: {
        title: "COVID19",
        body: "Hello World",
        createdAt: "2021-05-25T12:19:33.039Z",
        updatedAt: "2021-05-25T12:19:33.039Z",
        alertLevel: "warn",
        states: {
            data: [],
        },
        screenLocation: "homePage",
        defaultToOpen: false,
    },
}
export const nationalServiceAlert: Alert = {
    id: 4,
    attributes: {
        title: "A national service page alert",
        body: "",
        createdAt: "2021-05-25T12:19:33.039Z",
        updatedAt: "2021-05-25T12:19:33.039Z",
        alertLevel: "info",
        states: {
            data: [],
        },
        screenLocation: "servicePage",
        defaultToOpen: false,
    },
}
export const vicServiceAlert: Alert = {
    id: 5,
    attributes: {
        title: "A vic service page alert",
        body: "",
        createdAt: "2021-05-25T12:19:33.039Z",
        updatedAt: "2021-05-25T12:19:33.039Z",
        alertLevel: "info",
        states: {
            data: [
                { attributes: { Name: "VIC" } },
            ],
        },
        screenLocation: "servicePage",
        defaultToOpen: false,
    },
}
export const waServiceAlert: Alert = {
    id: 6,
    attributes: {
        title: "A wa service page alert",
        body: "",
        createdAt: "2021-05-25T12:19:33.039Z",
        updatedAt: "2021-05-25T12:19:33.039Z",
        alertLevel: "info",
        states: {
            data: [
                { attributes: { Name: "WA" } },
            ],
        },
        screenLocation: "servicePage",
        defaultToOpen: false,
    },
}
export const resultsPageNationalInfoAlert: Alert = {
    id: 7,
    attributes: {
        title: "The fox jumped over the dog",
        body: "",
        createdAt: "2021-05-25T12:19:56.159Z",
        updatedAt: "2021-05-25T12:19:56.159Z",
        alertLevel: "info",
        states: {
            data: [],
        },
        screenLocation: "resultsPage",
        defaultToOpen: false,
    },
}
export const resultsPageTasInfoAlert: Alert = {
    id: 8,
    attributes: {
        title: "A tas specific alert",
        body: "",
        createdAt: "2021-05-25T06:30:07.431Z",
        updatedAt: "2021-05-25T06:30:07.431Z",
        alertLevel: "warn",
        states: {
            data: [
                { attributes: { Name: "TAS" } },
            ],
        },
        screenLocation: "resultsPage",
        defaultToOpen: false,
    },
}
export const bodyOpenByDefaultResultsPageAlert: Alert = {
    id: 9,
    attributes: {
        title: "Title is always shown",
        body: "Body is open by default",
        createdAt: "2021-05-25T12:19:33.039Z",
        updatedAt: "2021-05-25T12:19:33.039Z",
        alertLevel: "info",
        states: {
            data: [],
        },
        screenLocation: "resultsPage",
        defaultToOpen: true,
    },
}

export const resultsPageAlerts: Array<Alert> = [
    resultsPageVicAndQldWarnAlert,
    covidServicesAffectedAlert,
    resultsPageNationalInfoAlert,
    bodyOpenByDefaultResultsPageAlert,
]

export const allAlerts: Array<Alert> = [
    resultsPageVicAndQldWarnAlert,
    covidServicesAffectedAlert,
    resultsPageNationalInfoAlert,
    covidInfoAlert,
    nationalServiceAlert,
    vicServiceAlert,
    waServiceAlert,
    resultsPageTasInfoAlert,
    bodyOpenByDefaultResultsPageAlert,
]
