import {GTMEvent} from "@/src/google-tag-manager"

export {};

declare global {
  interface Window {
    dataLayer: Array<GTMEvent>
    google_tag_manager: any
    IzzyStorage: any
  }
}