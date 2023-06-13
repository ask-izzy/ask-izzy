import React, {ReactNode} from "react";

import HeaderBar from "@/src/components/HeaderBar.js";

declare let storyBookControlValues: {
    HeaderBar: {
        bannerName: Array<string>;
    };
};
export default {
    title: "App Components/HeaderBar",
    component: HeaderBar,
    argTypes: {
        bannerName: {
            control: {
                type: "select",
                options: storyBookControlValues.HeaderBar.bannerName
            }
        },
        taperColour: {
            control: {
                type: "select",
                options: ["Grey", "DarkGrey", "LighterGrey", "Purple"]
            }
        }
    },
    parameters: {
        backgrounds: {
            default: "white",
            values: [{
                name: "white",
                value: "#fff"
            }, {
                name: "grey",
                value: "#edece9"
            }, {
                name: "dark grey",
                value: "#363e43"
            }, {
                name: "lighter grey",
                value: "#dddddd"
            }, {
                name: "purple",
                value: "hsl(262, 80%, 38%)"
            }]
        }
    }
};

const Template = (args): ReactNode => {
    return <HeaderBar {...args} />;
};

export const StandardBackgroundColour = Template.bind({});
StandardBackgroundColour.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    bannerName: "food"
};
export const GreyBackgroundColour = Template.bind({});
GreyBackgroundColour.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    bannerName: "food",
    taperColour: "Grey"
};
GreyBackgroundColour.parameters = {
    backgrounds: {
        default: "grey"
    }
};
export const ContainsJSX = Template.bind({});
ContainsJSX.args = {
    primaryText: <strong>Bold Text</strong>,
    secondaryText: <em>Italicised text</em>,
    bannerName: "housing"
};
export const LongText = Template.bind({});
LongText.args = {
    primaryText: "A Very Long Primary Text Value That Just Keeps Going And " +
        "Going And Going And Going And Going And Going And Going",
    secondaryText: <div>
        Yet more verbose text for the secondary text. Once you start You just can&apos;t
        quit. It&apos;s like the hotel california. You know the song right? Everyone
        does. <br /><br />
        Last thing I remember, I was <br />
        Running for the door <br />
        I had to find the passage back <br />
        To the place I was before <br />
        &quot;Relax,&quot; said the night man <br />
        &quot;We are programmed to receive <br />
        You can check out any time you like <br />
        But you can never leave!&quot;
    </div>,
    bannerName: "health"
};
export const InfoTextNoSecondary = Template.bind({});
InfoTextNoSecondary.args = {
    primaryText: "Primary Text",
    infoText: "Info Text",
    bannerName: "food"
};
export const InfoTextWithSecondary = Template.bind({});
InfoTextWithSecondary.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary Text",
    infoText: "Info Text",
    bannerName: "food"
};