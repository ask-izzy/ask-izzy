/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import LoadingResultsHeader from "./LoadingResultsHeader";
import { getCategory } from "../../constants/categories";
import Category from "../../constants/Category"
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
        category: (getCategory("housing"): ?Category),
        title: "Housing",
        personalisationComponents: (
            getCategory("housing")?.personalisation: void | Array<any>
        ),
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

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <LoadingResultsHeader {...args} />;
};

export const HousingCategoryWithASingleResult: typeof Template =
    Template.bind({});
HousingCategoryWithASingleResult.args = {
    meta: {
        total_count: 1,
    },
};

export const HousingCategoryWithAFewResults: typeof Template =
    Template.bind({});
HousingCategoryWithAFewResults.args = {
    meta: {
        total_count: 8,
    },
};

export const HousingCategoryWithLotsOfResults: typeof Template =
    Template.bind({});
HousingCategoryWithLotsOfResults.args = {
    meta: {
        total_count: 42,
    },
};

export const HousingCategoryWithNoResults: typeof Template = Template.bind({});
HousingCategoryWithNoResults.args = {
    meta: {
        total_count: 0,
    },
};

export const Loading: typeof Template = Template.bind({});
Loading.args = {
    loading: true,
};


export const Error: typeof Template = Template.bind({});
Error.args = {
    error: "Helpful error message",
};


export const ErrorWithStatusCode402: typeof Template = Template.bind({});
ErrorWithStatusCode402.args = {
    error: "Helpful error message",
    statusCode: 402,
    location: {pathname: "/"},
};

