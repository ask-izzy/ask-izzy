/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Switch from "./Switch";

export default {
    title: "General Components/Switch",
    component: Switch,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any);
    const {children, props} = args
    return (
        <Switch {...props}>
            {children}
        </Switch>
    );
};

export const ConditionGivenMatchBar: typeof Template = Template.bind({});
ConditionGivenMatchBar.args = {
    condition: "bar",
    children: [
        <div switch-if="foo">foo</div>,
        <div switch-if="bar">bar</div>,
        <div>default</div>,
    ],
};

export const ConditionGivenMatchFoo: typeof Template = Template.bind({});
ConditionGivenMatchFoo.args = {
    condition: "foo",
    children: [
        <div switch-if="foo">foo</div>,
        <div switch-if="bar">bar</div>,
        <div>default</div>,
    ],
};

export const ConditionGivenNoMatchUseDefault: typeof Template =
    Template.bind({});
ConditionGivenNoMatchUseDefault.args = {
    condition: "cake",
    children: [
        <div switch-if="foo">foo</div>,
        <div switch-if="bar">bar</div>,
        <div>default</div>,
    ],
};

export const ConditionGivenNoMatchNoDefault: typeof Template =
    Template.bind({});
ConditionGivenNoMatchNoDefault.args = {
    condition: "cake",
    children: [
        <div switch-if="foo">foo</div>,
        <div switch-if="bar">bar</div>,
    ],
};

export const NoConditionFirstMatchTrue: typeof Template = Template.bind({});
NoConditionFirstMatchTrue.args = {
    children: [
        <div switch-if={1 === 2}>first false</div>,
        <div switch-if={1 === 1}>first true</div>,
        <div switch-if={false}>second false</div>,
        <div switch-if={true}>second true</div>,
        <div>default</div>,
    ],
};

export const NoConditionNoMatchUseDefault: typeof Template = Template.bind({});
NoConditionNoMatchUseDefault.args = {
    children: [
        <div switch-if={false}>first false</div>,
        <div switch-if={1 === 2}>second false</div>,
        <div>default</div>,
    ],
};

export const NoConditionNoMatchNoDefault: typeof Template = Template.bind({});
NoConditionNoMatchNoDefault.args = {
    children: [
        <div switch-if={false}>first false</div>,
        <div switch-if={1 === 2}>second false</div>,
    ],
};

export const NoConditionChildrenContainTextNodeMatchFirstTrue:
    typeof Template = Template.bind({});
NoConditionChildrenContainTextNodeMatchFirstTrue.args = {
    children: [
        "foobar",
        <div switch-if={1 === 2}>first false</div>,
        <div switch-if={1 === 1}>first true</div>,
        <div switch-if={false}>second false</div>,
        <div switch-if={true}>second true</div>,
    ],
};

export const NoConditionNoChildren: typeof Template = Template.bind({});
NoConditionNoChildren.args = {
};
