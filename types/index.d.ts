import {GTMEvent} from "@/src/google-tag-manager"

export {};

declare global {
  interface Window {
    dataLayer: Array<GTMEvent>
    google_tag_manager: any
    IzzyStorage: any
    waitTillPageLoaded: () => Promise<void>
    googleMocks: [{
        DistanceMatrixService: () => {
            getDistanceMatrix: (params: any, callback: any) => any;
        };
    }]
  }
  interface Error {
    statusCode?: number
    resBodyText?: string
    resBodyJSON?: any
    url?: string
}
}
