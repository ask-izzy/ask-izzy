/* @flow */

import React from "react";
import StaticPage from "../../pages/StaticPage";

type Props = {
    title: string,
    content: string,
    banner: string,
};

class ContentPage extends React.Component<Props> {

    render() {
        return (
            <StaticPage
                title={this.props.title}
                bannerName={this.props.banner}
            >
                <div className="body">{this.props.content}</div>
            </StaticPage>
        );
    }

}

export default ContentPage;
