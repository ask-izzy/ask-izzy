/* @flow */

import Spacing from "material-ui/lib/styles/spacing";
import light from "material-ui/lib/styles/raw-themes/light-raw-theme";

// Override colors & themes here
export default {
    fontFamily: "Gotham Rounded A, Gotham Rounded B, sans-serif",
    spacing: Spacing,
    palette: Object.assign({}, light.palette, {
        accent1Color: "#EEEEEE",
        accent2Color: "#999999",
        textColor: "#363e43",  // brand-text-dark
        alternateTextColor: "#767676",  // brand-text-mid
    }),

};
