import React, { useState, useEffect, ReactNode} from "react";
import escapeStringRegexp from "escape-string-regexp";

import InputWithDropdown from "@/components/general/InputWithDropdown.js";
import SearchIcon from "@/src/icons/Search.js";

export default {
    title: "General Components/InputWithDropdown",
    component: InputWithDropdown,
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        autocompleteDecorator,
        /* Provide state for input value */
        (Story: Record<string, any>, {
            parameters,
            args
        }: Record<string, any>): void => {
            const [value, setValue] = useState(parameters.initialValue || "");
            return (Story as any)({
                args: { ...args,
                    value,
                    onChange: event => {
                        console.log("onChange storybook", event);
                        setValue(event.target.value);
                    }
                }
            });
        }],
    excludeStories: ["autocompleteDecorator"]
};

const Template = (args): ReactNode => {
    return <InputWithDropdown {...args} />;
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
export const WithAutocomplete = Template.bind({});
WithAutocomplete.args = {
    placeholder: "Try searching \"apple\""
};
WithAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"]
};
export const WithIconAndClearButtonAndAutocomplete = Template.bind({});
WithIconAndClearButtonAndAutocomplete.args = {
    showClearButton: true,
    icon: <SearchIcon />,
    placeholder: "Try searching \"apple\""
};
WithIconAndClearButtonAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"]
};
export const WithInitialValueAndAutocomplete = Template.bind({});
WithInitialValueAndAutocomplete.args = {
    placeholder: "Try searching \"apple\""
};
WithInitialValueAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
    initialValue: "app"
};
export function autocompleteDecorator(Story: Record<string, any>, {
    parameters,
    args
}: Record<string, any>): void {
    const [autocompleteValues, setAutocompleteValues] = useState([]);

    if (!parameters.autocompleteFullList) {
        return (Story as any)();
    }

    useEffect(() => {
        const initialValue = args.value ?? args.initialValue;

        if (initialValue) {
            filterAutocompleteValues(initialValue);
        }
    }, []);

    function onChange(event) {
        filterAutocompleteValues(event.target.value);
        args.onChange?.(event);
    }

    function filterAutocompleteValues(text) {
        setAutocompleteValues(
            parameters
                .autocompleteFullList
                .filter(
                    value => value.match(new RegExp(`^${escapeStringRegexp(text.trim())}`, "i"))
                ));
    }

    return (Story as any)({
        args: { ...args,
            onChange,
            autocompleteValues
        }
    });
}