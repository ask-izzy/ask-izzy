import React, { Component, PropTypes } from "react";

import Footer from "../components/Footer";

class Page extends Component {
    static propTypes = {
        footer: PropTypes.bool,
    }

    static defaultProps = {
        footer: true,
    }

    render() {
        const { footer } = this.props;

        return (
            <div className="Page">

                <div className="Page-body">
                    { this.props.children }
                </div>

                { footer &&
                    <div className="Page-footer">
                        <Footer />
                    </div>
                }

            </div>
        );
    }

}

export default Page;
