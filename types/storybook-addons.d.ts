declare module "@storybook/addon-links/react" {
	import { ComponentType } from "react";
	interface LinkToProps {
		kind: string;
		story: string;
		children?: React.ReactNode;
	}
	const LinkTo: ComponentType<LinkToProps>;
	export default LinkTo;
  }