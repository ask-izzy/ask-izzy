import {GTMEvent} from "@/src/google-tag-manager.js"

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
	interface MyProcessFile extends ProcessFile {
		from: any;
	}
}
declare module "react" {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// extends React's HTMLAttributes
		content?: string
	}
}

declare module "@mui/material/Tooltip" {
	import { ReactNode, ReactElement } from "react";

	export type TooltipProps = {
		content: ReactNode,
		disableHoverListener?: boolean,
		disableTouchListener?: boolean,
		disableFocusListener?: boolean,
		children: ReactElement,
		componentsProps?: Record<any, any>,
		open?: boolean,
	}

	const Tooltip: React.FC<TooltipProps>;

	export default Tooltip;
  }
