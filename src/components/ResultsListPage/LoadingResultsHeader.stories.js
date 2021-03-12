/* @flow */

import React from "react";

import LoadingResultsHeader from "./LoadingResultsHeader";
import { getCategory } from "../../constants/categories";
import {
    addRouter,
    setPersonalisationAnswers,
    setRouterContext,
} from "../../storybook/decorators";

export default {
    title: "App Components/HeaderBar/LoadingResultsHeader",
    component: LoadingResultsHeader,
    decorators: [
        addRouter,
        setPersonalisationAnswers,
        setRouterContext,
    ],
    args: {
        category: getCategory("housing"),
        title: "Housing",
        personalisationComponents: getCategory("housing")?.personalisation,
        location: {pathname: "/"},
        meta: {
            total_count: 42,
        },
    },
    parameters: {
        context: {
            personalisationAnswers: {
                location: "Richmond, VIC",
                "sleep-tonight": "Yes",
                gender: "Female",
                age: "27 to 39",
                demographics: ["Couples", "Have pets"],
            },
        },
    },
};

const Template = (args: Object) => <LoadingResultsHeader {...args} />;

export const HousingCategoryWithASingleResult = Template.bind({});
HousingCategoryWithASingleResult.args = {
    meta: {
        total_count: 1,
    },
};

export const HousingCategoryWithAFewResults = Template.bind({});
HousingCategoryWithAFewResults.args = {
    meta: {
        total_count: 8,
    },
};

export const HousingCategoryWithLotsOfResults = Template.bind({});
HousingCategoryWithLotsOfResults.args = {
    meta: {
        total_count: 42,
    },
};

export const HousingCategoryWithNoResults = Template.bind({});
HousingCategoryWithNoResults.args = {
    meta: {
        total_count: 0,
    },
};

export const Loading = Template.bind({});
Loading.args = {
    loading: true,
};


export const Error = Template.bind({});
Error.args = {
    error: "Helpful error message",
};


export const ErrorWithStatusCode402 = Template.bind({});
ErrorWithStatusCode402.args = {
    error: "Helpful error message",
    statusCode: 402,
    location: {pathname: "/"},
};

