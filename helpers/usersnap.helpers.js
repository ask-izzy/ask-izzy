/* @Flow */

export function usersnapFireEvent(event: string) {
    if (typeof window !== "undefined") {
        if (window.Usersnap) {
            window.Usersnap.logEvent(event);
        } else {
            const intervalId = setInterval(() => {
                if (window.Usersnap) {
                    window.Usersnap.logEvent(event);
                    clearInterval(intervalId)
                }
            }, 1000)
        }
    }
}
