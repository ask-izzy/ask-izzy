/* @flow */

import InitActions from "./pages/InitActions";
import categories from "./constants/categories";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";

var categoryRoutes = Object
    .keys(categories)
    .map((k) => categories[k])
    .join("|");

export default {

    home: {
        path: "/",
        method: "get",
        handler: HomePage,
    },

    category: {
        path: `/categories/:category(${categoryRoutes})`,
        method: "get",
        handler: CategoryPage,
        action: InitActions.categoryPage,
    },

    // This route doesn't point to any handler.
    bad: {
        path: "/bad",
        method: "get",
        action: InitActions.badPage,
    },
};
