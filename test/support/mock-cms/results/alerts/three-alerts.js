export default {
    data: {
        alerts: [
            {
                id: "2",
                title: "A vic and qld specific alert",
                body: "",
                created_at: "2021-05-25T06:30:07.431Z",
                alertLevel: "warn",
                states: [
                    { Name: "VIC", __typename: "State" },
                    { Name: "QLD", __typename: "State" },
                ],
                screenLocation: "resultsPage",
                __typename: "Alert",
            },
            {
                id: "3",
                title: "COVID19 affecting services",
                body:
                    "Services listed here may not be operating or limited. Contact services directly for up-to-date information.\n\n[Get COVID19 help and information near you.](/covid-19-support)",
                created_at: "2021-05-25T12:19:33.039Z",
                alertLevel: "warn",
                states: [],
                screenLocation: "resultsPage",
                __typename: "Alert",
            },
            {
                id: "4",
                title: "The fox jumped over the dog",
                body: null,
                created_at: "2021-05-25T12:19:56.159Z",
                alertLevel: "info",
                states: [],
                screenLocation: "resultsPage",
                __typename: "Alert",
            },
        ],
    }
}
