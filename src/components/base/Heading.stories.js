/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Heading from "./Heading";
import DocLevel from "../helpers/DocLevel"

export default {
    title: "Base Components/Heading",
    component: Heading,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DocLevel>
        <Heading {...args} />
    </DocLevel>;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: "cake",
};

export const AllHeadingSizes = (args: Object): ReactNode => {
    (Template.args: any); return <DocLevel>
        <Heading>Heading 1</Heading>
        <DocLevel>
            <Heading>Heading 2</Heading>
            <DocLevel>
                <Heading>Heading 3</Heading>
                <DocLevel>
                    <Heading>Heading 4</Heading>
                    <DocLevel>
                        <Heading>Heading 5</Heading>
                        <DocLevel>
                            <Heading>Heading 6</Heading>
                        </DocLevel>
                    </DocLevel>
                </DocLevel>
            </DocLevel>
        </DocLevel>
    </DocLevel>;
}
AllHeadingSizes.args = {
    children: "cake",
};
