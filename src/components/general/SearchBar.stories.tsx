import React, {ReactNode} from "react";
import {$Diff} from "utility-types";
import {action} from "@storybook/addon-actions";

import SearchBar from "@/src/components/general/SearchBar.js";
import {autocompleteDecorator} from "@/components/general/InputWithDropdown.stories.js";


export default {
    title: "General Components/SearchBar",
    component: SearchBar,
    args: {
        onClick: (action("clicked")),
        onSubmit: (action("submitted"))
    },
    decorators: [
        /* Set autocomplete value list if using autocomplete */
        autocompleteDecorator]
};

type SearchBarProps = Parameters<typeof SearchBar>[0]
type RequiredSearchBarProps = $Diff<SearchBarProps, {
  onSubmit: Parameters<typeof SearchBar>[0]["onSubmit"]
}>;

const Template = (args: RequiredSearchBarProps): ReactNode => {
    return <SearchBar {...args as SearchBarProps} />;
};

export const Example = Template.bind({});
Example.args = {};
export const WithInitialValue = Template.bind({});
WithInitialValue.args = {
    initialValue: "Initial search value"
};
export const WithAutocomplete = Template.bind({});
WithAutocomplete.args = {
    placeholder: "Try searching \"apple\""
};
WithAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"]
};
export const WithInitialValueAndAutocomplete = Template.bind({});
WithInitialValueAndAutocomplete.args = {
    placeholder: "Try searching \"apple\"",
    initialValue: "app"
};
WithInitialValueAndAutocomplete.parameters = {
    autocompleteFullList: ["apple", "berry", "orange"]
};