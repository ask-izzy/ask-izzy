/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import StrapiMarkdown from "./StrapiMarkdown";

export default {
    title: "App Components/StrapiMarkdown",
    component: StrapiMarkdown,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any)
    window.STRAPI_URL = "/static/media/public"
    return <StrapiMarkdown {...args} />
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: `
# This is a Heading
## Sub heading 2
### Sub heading 3
#### Sub heading 4
##### Sub heading 5
###### Sub heading 6

**bold text** *italic text* ~~striked out~~

- Bullet 1
- Bullet 2
1. Number 1
2. Number 2
\`\`\`code block\`\`\`

![ask-izzy-logo.png](/static/images/ask-izzy-logo-single-line-purple.svg)

[Click here](https://www.google.com.au/)
> This is Cozzy's quote
    `,
};
