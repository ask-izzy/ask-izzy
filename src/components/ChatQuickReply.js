/* @flow */

import * as React from "react";

type Props = {
    action: string,
    onClick?: Function,
};

class ChatQuickReply extends React.Component<Props, void> {
    handleClick(): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render(): React.Element<any> {
        return (
            <div
                className="ChatQuickReply"
                onClick={this.handleClick.bind(this)}
            >
                {this.props.action}
            </div>
        );
    }
}

export default ChatQuickReply;
