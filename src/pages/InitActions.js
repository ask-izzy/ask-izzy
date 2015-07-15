// Actions to run when the router matches a route. Used in app/routes.js

const InitActions = {

    // do not load something, just send an error in the callback
    // to show how the app react with errors
    badPage(context, route, done) {
        const err = new Error();
        err.message = "Do not worry, just giving a try.";
        done(err);
    },

};

export default InitActions;
