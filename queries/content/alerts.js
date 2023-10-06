/* @flow */

import gql from "graphql-tag";

const alertsQuery: any = gql`
query Alerts(
    $state: [String],
    $screenLocation: String,
) {
    alerts(
        filters: {
            states: {
                or: [
                    { id: {null: true} }
                    { Name: {in: $state} }
                ]
            }
            screenLocation: {eq: $screenLocation}
        }
    ) {
        data {

            id
            attributes {
                title
                body
                createdAt
                updatedAt
                alertLevel
                defaultToOpen
                states {
                    data {
                        attributes {
                            Name
                        }
                    }
                }
                screenLocation
            }
        }
    }
}
`

export default alertsQuery

export type CmsResponseAlerts = {
    alerts: {
        data: Array<CmsAlert>
    } | null
}

export type CmsAlert = {
    id: number | null,
    attributes: {
        title: string,
        body: string,
        createdAt: string | null,
        updatedAt: string | null,
        alertLevel: string,
        defaultToOpen: boolean | null,
        states: {
            data: Array<{
                attributes: {
                    Name: string,
                } | null
            }>
        } | null,
        screenLocation: string,
    } | null
}
