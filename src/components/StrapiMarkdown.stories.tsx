import React, {ReactNode} from "react";

import StrapiMarkdown from "@/src/components/StrapiMarkdown.js";

export default {
    title: "App Components/StrapiMarkdown",
    component: StrapiMarkdown,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <StrapiMarkdown {...args} />;
};

export const Example = Template.bind({});
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

![ask-izzy-logo.png](/images/ask-izzy-logo-single-line-purple.svg)

[Click here](https://www.google.com.au/)
> This is Cozzy's quote
    `
};