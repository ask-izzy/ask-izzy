import {GTMEvent} from "@/src/google-tag-manager"

export {};

declare global {
  interface Window {
    dataLayer: Array<GTMEvent>
    google_tag_manager: any
    IzzyStorage: any
    waitTillPageLoaded: () => Promise<void>
    pi: any
    localStorage: any
    recaptchaOptions: any
    Usersnap: any
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
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    content?: string
  }
}
