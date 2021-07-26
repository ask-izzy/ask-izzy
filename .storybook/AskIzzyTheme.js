/* @flow */

import { create } from "@storybook/theming";

import logo from "../public/static/images/ask-izzy-logo-single-line-purple.svg";

export default (create({
    base: "light",
    brandTitle: "Ask Izzy Logo",
    brandImage: logo,
}): Object);
