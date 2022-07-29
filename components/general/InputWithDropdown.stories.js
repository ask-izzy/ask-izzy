/* @flow */

import React, {useState, useEffect} from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";
import escapeStringRegexp from "escape-string-regexp";

import InputWithDropdown from "./InputWithDropdown"
import SearchIcon from "@/src/icons/Search"

export default {
    title: "General Components/InputWithDropdown",
    component: InputWithDropdown,
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        autocompleteDecorator,
        /* Provide state for input value */
        (Story: Object, {parameters, args}: Object): void => {
            const [value, setValue] = useState(parameters.initialValue || "")
            return Story({
                args: {
                    ...args,
                    value,
                    onChange: (event) => {
                        console.log("onChange storybook", event)
                        setValue(event.target.value)
                    },
                },
            })
        },
    ],
    excludeStories: ["autocompleteDecorator"],
};

type InputProps = ReactElementConfig<typeof InputWithDropdown>
type InputRequiredProps = $Diff<
    InputProps,
    {
        onChange: $PropertyType<InputProps, 'onChange'>,
        value: $PropertyType<InputProps, 'value'>,
    }
>

const Template = (args: InputProps): ReactNode => {
    (Template.args: InputRequiredProps);
    return <InputWithDropdown {...args} />;
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

export const WithAutocomplete: typeof Template = Template.bind({});
WithAutocomplete.args = {
    placeholder: "Try searching \"apple\"",
};
WithAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
};

export const WithIconAndClearButtonAndAutocomplete: typeof Template =
    Template.bind({});
WithIconAndClearButtonAndAutocomplete.args = {
    showClearButton: true,
    icon: <SearchIcon />,
    placeholder: "Try searching \"apple\"",
};
WithIconAndClearButtonAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
};

export const WithInitialValueAndAutocomplete: typeof Template =
    Template.bind({});
WithInitialValueAndAutocomplete.args = {
    placeholder: "Try searching \"apple\"",
};
WithInitialValueAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
    initialValue: "app",
};

export function autocompleteDecorator(
    Story: Object,
    {parameters, args}: Object
): void {
    const [autocompleteValues, setAutocompleteValues] = useState([])
    if (!parameters.autocompleteFullList) {
        return Story()
    }
    useEffect(() => {
        const initialValue = args.value ?? args.initialValue
        if (initialValue) {
            filterAutocompleteValues(initialValue)
        }
    }, [])
    function onChange(event) {
        filterAutocompleteValues(event.target.value)
        args.onChange?.(event)
    }
    function filterAutocompleteValues(text) {
        setAutocompleteValues(
            parameters.autocompleteFullList.filter(
                value => value.match(
                    new RegExp(`^${escapeStringRegexp(text.trim())}`, "i")
                )
            )
        )
    }
    return Story({args: {...args, onChange, autocompleteValues}})
}
