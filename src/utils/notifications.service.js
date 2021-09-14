/* @flow */

import API from "axios"

export const notificationApi = () => {
    console.log("test")
    if (typeof window !== "undefined") {
        console.log(window.NOTIFICATIONS_API_URL)
        console.log(window.NOTIFICATIONS_API_KEY)
        return API.create({
            baseURL: window.NOTIFICATIONS_API_URL + "api/v1/",
            headers: {
                "Authorization": `Api-Key ${NOTIFICATIONS_API_KEY}`,
            },
        })
    }
}
