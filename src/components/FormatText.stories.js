/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import FormatText from "./FormatText";

export default {
    title: "App Components/FormatText",
    component: FormatText,
};
const Template = ({text, ...argsForFormatText}: Object): ReactNode => {
    (Template.args: any);
    return <FormatText {...argsForFormatText}>{text}</FormatText>;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    text: "Bookings can be made online at " +
        "https://www.coronavirus.vic.gov.au/book-your-vaccine-appointment" +
        " or by telephone on 1800 675 398.",
};

export const MultiLineExample: typeof Template = Template.bind({});
MultiLineExample.args = {
    text: `Registration form is available online at https://docs.google.com/forms/d/e/1FAIpQLSdsoqOLHMEUJ_` +
        `i30ZFBkQfeQfLHCfnaMGCc6-8SQ7CxCTso8Q/viewform.  http://fasdfa.com    www.fire.com

        And more. And more.

        On a new line.


        Line with
        Single break

        Good for:

        - dot points
        - like this



        With lots of space.`,
};



export const MultipleChildrenExample: typeof Template = Template.bind({});
MultipleChildrenExample.args = {
    text: ["Line one. Of Child one.", "Child two."],
}

export const LongWordExample: typeof Template = Template.bind({});
LongWordExample.args = {
    text: [
        "Example with really long word supercalifragiexpialidocioussuper",
        "califragiexpialidocioussupercalifragiexpialidocious.",
    ],
}