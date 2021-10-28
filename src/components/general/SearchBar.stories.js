/* @flow */

import React from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";
import { action } from "@storybook/addon-actions";

import SearchBar from "./SearchBar"
import {autocompleteDecorator} from "../base/Input.stories"

export default {
    title: "General Components/SearchBar",
    component: SearchBar,
    args: {
        onClick: (action("clicked"): any),
        onSubmit: (action("submitted"): any),
    },
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        autocompleteDecorator,
    ],
};

type SearchBarProps = ReactElementConfig<typeof SearchBar>
type RequiredSearchBarProps = $Diff<
    SearchBarProps,
    {
        onSubmit: $PropertyType<SearchBarProps, 'onSubmit'>,
    }
>

const Template = (args: SearchBarProps): ReactNode => {
    (Template.args: RequiredSearchBarProps);
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
    initialValue: "Initial search value",
};
WithInitialValueAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"],
};
