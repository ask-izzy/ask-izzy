import React from "react";
import HeaderBar from "./HeaderBar";

export default {
    title: "Page Components/HeaderBar",
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
            default: "White",
            values: [
                { name: "White", value: "#fff" },
                { name: "Grey", value: "#edece9" },
                { name: "DarkGrey", value: "#363e43" },
                { name: "LighterGrey", value: "#dddddd" },
                { name: "Purple", value: "hsl(262, 80%, 38%)" },
            ],
        },
    },
};

const Template = (args) => <HeaderBar {...args} />;

export const StandardBackgroundColour = Template.bind({});
StandardBackgroundColour.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    bannerName: "food",
};

export const GreyBackgroundColour = Template.bind({});
GreyBackgroundColour.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    bannerName: "food",
    taperColour: "Grey",
};
GreyBackgroundColour.parameters = {
    backgrounds: {
        default: "Grey",
    },
};

export const ContainsJSX = Template.bind({});
ContainsJSX.args = {
    primaryText: <strong>Bold Text</strong>,
    secondaryText: <em>Italicised text</em>,
    bannerName: "housing",
};

export const LongText = Template.bind({});
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