declare module "next/head" {
    import { Head } from "next/document";
    export default Head;
}

declare module "next/router" {
	import {NextRouter} from "next/dist/client/router";
	export type NextRouter = NextRouter;
	export interface WithRouterProps {
		router: NextRouter;
	}

	export function useRouter(): NextRouter;
	export function withRouter<T>(
		Component: React.ComponentType<T & WithRouterProps>
	): React.ComponentType<T>;
}

declare module "next/error" {
	import { NextPage } from "next";
	import { NextErrorComponent, ErrorProps } from "next/error";

	const Error: NextPage<ErrorProps> & {
		getInitialProps: NextErrorComponent["getInitialProps"];
	};

	export default Error;
	}

declare module "next/link" {
	import LinkOriginal from "next/dist/client/link";

	const Link: typeof LinkOriginal = LinkOriginal;

	export default Link;
	}