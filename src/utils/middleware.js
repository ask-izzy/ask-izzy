/* @flow */

// $FlowIgnore Type this with typescript
export async function callMiddlewares(middlewares, request, response) {
    await Promise.all(
        middlewares
            .map(middleware => middleware(request, response))
    );
}
