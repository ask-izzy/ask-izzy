import React, {useState, useRef} from "react";
import type {
    ReactNode,
    ComponentProps as ReactElementConfig,
} from "react";

import Input from "./Input"
import SearchIcon from "../../icons/Search"

export default {
    title: "Base Components/Input",
    component: Input,
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        customInputElementDecorator,
        /* Provide state for input value */
        (Story: any, {parameters, args}: any): void => {
            const [value, setValue] = useState(parameters.initialValue || "")
            return Story({
                args: {
                    ...args,
                    value,
                    onChange: (event) => setValue(event.target.value),
                },
            })
        },
    ],
};

type InputProps = ReactElementConfig<typeof Input>

const Template = (args: InputProps): ReactNode => {
    (Template.args as any);
    return <Input {...args} />;
};

export const Example: typeof Template = Template.bind({});

export const WithPlaceholder: typeof Template = Template.bind({});
WithPlaceholder.args = {
    placeholder: "Placeholder text",
};

export const WithClearButton: typeof Template = Template.bind({});
WithClearButton.args = {
    showClearButton: true,
};

export const WithIcon: typeof Template = Template.bind({});
WithIcon.args = {
    icon: <SearchIcon />,
};

export const WithIconAndClearButton: typeof Template = Template.bind({});
WithIconAndClearButton.args = {
    showClearButton: true,
    icon: <SearchIcon />,
};


export const WithCustomInputElement: typeof Template = Template.bind({});
WithCustomInputElement.parameters = {
    useCustomInputElement: true,
};

export const WithIconAndClearButtonAndCustomInputElement: typeof Template =
    Template.bind({});
WithIconAndClearButtonAndCustomInputElement.args = {
    showClearButton: true,
    icon: <SearchIcon />,
    placeholder: "Try searching \"apple\"",
};
WithIconAndClearButtonAndCustomInputElement.parameters = {
    useCustomInputElement: true,
};

export const WithInitialValueAndCustomInputElement: typeof Template =
    Template.bind({});
WithInitialValueAndCustomInputElement.args = {
    placeholder: "Try searching \"apple\"",
};
WithInitialValueAndCustomInputElement.parameters = {
    useCustomInputElement: true,
    initialValue: "app",
};


function customInputElementDecorator(
    Story: any,
    {parameters, args}: any
): void {
    if (!parameters.useCustomInputElement) {
        return Story()
    }
    const ref = useRef(null)
    const customInputElement = (props) =>
        <input
            {...props}
            ref={ref}
        />
    return Story({args: {...args, customInputElement, ref}})
}
