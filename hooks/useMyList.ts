import {useMyListContext} from "@/contexts/my-list-context.js";
import useMyListToastMessage from "@/hooks/useMyListToastMessage.js"
import Service from "@/src/iss/Service.js"

type UseMyList = {
    myListServices: Array<Service>, // this array will be sorted from newest to oldest
    isLoading: boolean,
    addServiceToMyList: (service: Service) => void,
    removeServiceFromMyList: (service: Service) => void,
    clearAllMyListServices: () => void,
}

export default (): UseMyList => {
    const {myList, setMyList, isLoading} = useMyListContext()
    const {
        serviceAddedToMyList,
        serviceRemovedFromMyList,
        clearedAllServicesFromMyList,
    } = useMyListToastMessage()

    function addServiceToMyList(service: Service): void {
        setMyList([service, ...myList])
        serviceAddedToMyList()
    }

    function removeServiceFromMyList(service: Service): void {
        const previousMyList = myList
        setMyList(
            myList.filter(
                myListService => myListService.id !== service.id,
            ),
        )
        serviceRemovedFromMyList(() => setMyList(previousMyList))
    }

    function clearAllMyListServices(): void {
        const previousMyList = myList
        setMyList([])
        clearedAllServicesFromMyList(() => setMyList(previousMyList))
    }

    return {
        myListServices: myList,
        isLoading,
        addServiceToMyList,
        removeServiceFromMyList,
        clearAllMyListServices,
    }
}
