import React, { useState, useRef, ReactNode} from "react";

import Input from "@/src/components/base/Input.js";
import SearchIcon from "@/src/icons/Search.js";

export default {
    title: "Base Components/Input",
    component: Input,
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        customInputElementDecorator,
        /* Provide state for input value */
        (Story, {
            parameters,
            args
        }: Record<string, any>): void => {
            const [value, setValue] = useState(parameters.initialValue || "");
            return Story({
                args: { ...args,
                    value,
                    onChange: event => setValue(event.target.value)
                }
            });
        }]
};

const Template = (args): ReactNode => {
    return <Input {...args} />;
};

export const Example = Template.bind({});
export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
    placeholder: "Placeholder text"
};
export const WithClearButton = Template.bind({});
WithClearButton.args = {
    showClearButton: true
};
export const WithIcon = Template.bind({});
WithIcon.args = {
    icon: <SearchIcon />
};
export const WithIconAndClearButton = Template.bind({});
WithIconAndClearButton.args = {
    showClearButton: true,
    icon: <SearchIcon />
};
export const WithCustomInputElement = Template.bind({});
WithCustomInputElement.parameters = {
    useCustomInputElement: true
};
export const WithIconAndClearButtonAndCustomInputElement = Template.bind({});
WithIconAndClearButtonAndCustomInputElement.args = {
    showClearButton: true,
    icon: <SearchIcon />,
    placeholder: "Try searching \"apple\""
};
WithIconAndClearButtonAndCustomInputElement.parameters = {
    useCustomInputElement: true
};
export const WithInitialValueAndCustomInputElement = Template.bind({});
WithInitialValueAndCustomInputElement.args = {
    placeholder: "Try searching \"apple\""
};
WithInitialValueAndCustomInputElement.parameters = {
    useCustomInputElement: true,
    initialValue: "app"
};

function customInputElementDecorator(Story, {
    parameters,
    args
}: Record<string, any>): void {
    if (!parameters.useCustomInputElement) {
        return Story();
    }

    const ref = useRef(null);

    const customInputElement = props => (
        <input
            {...props}
            ref={ref}
        />)

    return Story({
        args: { ...args,
            customInputElement,
            ref
        }
    });
}