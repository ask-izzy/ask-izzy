// Override colors & themes here
export default {
    contentFontFamily: "Gotham Rounded A,Gotham Rounded B,sans-serif",

    getPalette: function() {
        return {
            accent1Color: "#EEEEEE",
            accent2Color: "#999999",
            textColor: "#363e43",  // brand-text-dark
            secondaryTextColor: "#767676",  // brand-text-mid
        };
    },

    getComponentThemes(palette) {
        return {};
    },
};
