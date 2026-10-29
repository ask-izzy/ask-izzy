import React from "react";
import type {
    ReactNode,
    ComponentProps as ReactElementConfig,
} from "react";
import { action } from "@storybook/addon-actions";

import SearchBar from "./SearchBar"
import {autocompleteDecorator} from "@/components/general/InputWithDropdown.stories"

export default {
    title: "General Components/SearchBar",
    component: SearchBar,
    args: {
        onClick: (action("clicked") as any),
        onSubmit: (action("submitted") as any),
    },
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        autocompleteDecorator,
    ],
};

type SearchBarProps = ReactElementConfig<typeof SearchBar>
type RequiredSearchBarProps = Omit<SearchBarProps, keyof {
        onSubmit: SearchBarProps["onSubmit"],
    }>

const Template = (args: SearchBarProps): ReactNode => {
    (Template.args as RequiredSearchBarProps);
    return <SearchBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {};

export const WithInitialValue: typeof Template = Template.bind({});
WithInitialValue.args = {
    initialValue: "Initial search value",
};

export const WithAutocomplete: typeof Template = Template.bind({});
WithAutocomplete.args = {
    placeholder: "Try searching \"apple\"",
};
WithAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
};
export const WithInitialValueAndAutocomplete: typeof Template =
    Template.bind({});
WithInitialValueAndAutocomplete.args = {
    placeholder: "Try searching \"apple\"",
    initialValue: "app",
};
WithInitialValueAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
};
