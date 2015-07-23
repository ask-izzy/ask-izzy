/* @flow */

import React from "react";

class ErrorPage extends React.Component {

    props: { err: { message: string } };

    render(): React.Element {
        var { err } = this.props;
        return (
            <div>
                <h1>Error displaying this page</h1>

                { process.env.DEBUG && err &&
                    <pre align="center">
                        { err.message }
                    </pre>
                }

            </div>
        );
    }

}

export default ErrorPage;
