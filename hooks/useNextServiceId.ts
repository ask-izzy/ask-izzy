let idCounter = 1

export default (): Function => {
    function getNextIdx() {
        idCounter += 1

        return idCounter
    }
    return getNextIdx
}

