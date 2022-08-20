/* @flow */

let idCounter = 1

export default (): function => {
    function getNextIdx() {
        idCounter += 1

        return idCounter
    }
    return getNextIdx
}

