import moment from "moment-timezone";

const timeOut = moment().add(3, "h");

export default function checkInactive(): void {
    try {
        if (moment().isAfter(timeOut)) {
            window.location.reload();
        }
    } catch (error) {
        // Don't let this break anything.
        console.log(error)
    }


}
