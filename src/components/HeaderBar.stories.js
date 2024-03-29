/* @flow */
import React from "react";
import type {Node as ReactNode} from "React";

import HeaderBar from "./HeaderBar";

declare var storyBookControlValues: {HeaderBar: {bannerName: Array<string>}};

export default {
    title: "App Components/HeaderBar",
    component: HeaderBar,
    argTypes: {
        bannerName: {
            control: {
                type: "select",
                options: storyBookControlValues.HeaderBar.bannerName,
            },
        },
        taperColour: {
            control: {
                type: "select",
                options: ["Grey", "DarkGrey", "LighterGrey", "Purple"],
            },
        },
    },
    parameters: {
        backgrounds: {
            default: "white",
            values: [
                { name: "white", value: "#fff" },
                { name: "grey", value: "#edece9" },
                { name: "dark grey", value: "#363e43" },
                { name: "lighter grey", value: "#dddddd" },
                { name: "purple", value: "hsl(262, 80%, 38%)" },
            ],
        },
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <HeaderBar {...args} />;
};

export const StandardBackgroundColour: typeof Template = Template.bind({});
StandardBackgroundColour.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    bannerName: "food",
};

export const GreyBackgroundColour: typeof Template = Template.bind({});
GreyBackgroundColour.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    bannerName: "food",
    taperColour: "Grey",
};
GreyBackgroundColour.parameters = {
    backgrounds: {
        default: "grey",
    },
};

export const ContainsJSX: typeof Template = Template.bind({});
ContainsJSX.args = {
    primaryText: <strong>Bold Text</strong>,
    secondaryText: <em>Italicised text</em>,
    bannerName: "housing",
};

export const LongText: typeof Template = Template.bind({});
LongText.args = {
    primaryText: "A Very Long Primary Text Value That Just Keeps Going And " +
      "Going And Going And Going And Going And Going And Going",
    secondaryText: <div>
    Yet more verbose text for the secondary text. Once you start You just can't
    quit. It's like the hotel california. You know the song right? Everyone
    does. <br /><br />
    Last thing I remember, I was <br />
    Running for the door <br />
    I had to find the passage back <br />
    To the place I was before <br />
    "Relax," said the night man <br />
    "We are programmed to receive <br />
    You can check out any time you like <br />
    But you can never leave!"
    </div>,
    bannerName: "health",
};

export const InfoTextNoSecondary: typeof Template = Template.bind({});
InfoTextNoSecondary.args = {
    primaryText: "Primary Text",
    infoText: "Info Text",
    bannerName: "food",
};

export const InfoTextWithSecondary: typeof Template = Template.bind({});
InfoTextWithSecondary.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    infoText: "Info Text",
    bannerName: "food",
};

