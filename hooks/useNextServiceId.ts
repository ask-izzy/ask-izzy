let idCounter = 1

export default (): () => number => {
    function getNextIdx() {
        idCounter += 1

        return idCounter
    }
    return getNextIdx
}

