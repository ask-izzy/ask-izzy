export default (
    parent, args, context, info
) => {
    const results = allAlerts.filter(alert => {
        if (
            info.variableValues?.screenLocation &&
            info.variableValues?.screenLocation[0] !== alert.screenLocation
        ) {
            return false
        }
        if (info.variableValues?.state) {
            const statesMatchResult = info.variableValues?.state.some(
                queryState => alert.states.some(
                    state => queryState === state.Name
                )
            ) || alert.states.length === 0
            if (!statesMatchResult) {
                return false
            }
        }
        return true
    })
    return results
}

export const resultsPageVicAndQldWarnAlert = {
    id: "1",
    title: "A vic and qld specific alert",
    body: "",
    created_at: "2021-05-25T06:30:07.431Z",
    updated_at: "2021-05-25T06:30:07.431Z",
    alertLevel: "warn",
    states: [
        { Name: "VIC", __typename: "State" },
        { Name: "QLD", __typename: "State" },
    ],
    screenLocation: "resultsPage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const covidServicesAffectedAlert = {
    id: "2",
    title: "COVID19 affecting services",
    body: (
        "Services listed here may not be operating or limited. Contact " +
        "services directly for up-to-date information.\n\n[Get COVID19 " +
        "help and information near you.](/covid-19-support)"
    ),
    created_at: "2021-05-25T12:19:33.039Z",
    updated_at: "2021-05-25T12:19:33.039Z",
    alertLevel: "warn",
    states: ([]),
    screenLocation: "resultsPage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const covidInfoAlert = {
    id: "3",
    title: "COVID19",
    body: "Hello World",
    created_at: "2021-05-25T12:19:33.039Z",
    updated_at: "2021-05-25T12:19:33.039Z",
    alertLevel: "warn",
    states: ([]),
    screenLocation: "homePage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const nationalServiceAlert = {
    id: "4",
    title: "A national service page alert",
    body: null,
    created_at: "2021-05-25T12:19:33.039Z",
    updated_at: "2021-05-25T12:19:33.039Z",
    alertLevel: "info",
    states: ([]),
    screenLocation: "servicePage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const vicServiceAlert = {
    id: "5",
    title: "A vic service page alert",
    body: null,
    created_at: "2021-05-25T12:19:33.039Z",
    updated_at: "2021-05-25T12:19:33.039Z",
    alertLevel: "info",
    states: [
        { Name: "VIC", __typename: "State" },
    ],
    screenLocation: "servicePage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const waServiceAlert = {
    id: "6",
    title: "A wa service page alert",
    body: null,
    created_at: "2021-05-25T12:19:33.039Z",
    updated_at: "2021-05-25T12:19:33.039Z",
    alertLevel: "info",
    states: [
        { Name: "WA", __typename: "State" },
    ],
    screenLocation: "servicePage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const resultsPageNationalInfoAlert = {
    id: "7",
    title: "The fox jumped over the dog",
    body: null,
    created_at: "2021-05-25T12:19:56.159Z",
    updated_at: "2021-05-25T12:19:56.159Z",
    alertLevel: "info",
    states: ([]),
    screenLocation: "resultsPage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const resultsPageTasInfoAlert = {
    id: "8",
    title: "A tas specific alert",
    body: "",
    created_at: "2021-05-25T06:30:07.431Z",
    updated_at: "2021-05-25T06:30:07.431Z",
    alertLevel: "warn",
    states: [
        { Name: "TAS", __typename: "State" },
    ],
    screenLocation: "resultsPage",
    defaultToOpen: false,
    __typename: "Alert",
}
export const bodyOpenByDefaultResultsPageAlert = {
    id: "9",
    title: "Title is always shown",
    body: "Body is open by default",
    created_at: "2021-05-25T12:19:33.039Z",
    updated_at: "2021-05-25T12:19:33.039Z",
    alertLevel: "info",
    states: ([]),
    screenLocation: "resultsPage",
    defaultToOpen: true,
    __typename: "Alert",
}

export const resultsPageAlerts = [
    resultsPageVicAndQldWarnAlert,
    covidServicesAffectedAlert,
    resultsPageNationalInfoAlert,
    bodyOpenByDefaultResultsPageAlert,
]

export const allAlerts = [
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
