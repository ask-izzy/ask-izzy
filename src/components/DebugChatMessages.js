/* @flow */

import React from "react";

type Props = {
    onMessageSubmit: Function,
}

type State = {
    message: string,
}

class DebugChatMessages extends React.Component<Props, State> {
    constructor(props: Props): void {
        super(props);

        this.state = {
            message: "",
        };
    }

    triggerTextIntent(action: SyntheticKeyboardEvent<HTMLInputElement>): void {
        if (action.key === "Enter") {
            this.props.onMessageSubmit(this.state.message)
            this.setState({ message: "" });
        }
    }

    /* eslint-disable-next-line max-len */
    setFieldValue(field: string, event: SyntheticInputEvent<HTMLInputElement>): void {
        let data = {};

        data[field] = event.target.value;
        this.setState(data);
    }

    render() {
        return (
            <div className="DebugChatMessages">
                <input
                    type="text"
                    value={this.state.message}
                    onChange={this.setFieldValue.bind(this, "message")}
                    aria-label="Text intent"
                    onKeyPress={this.triggerTextIntent.bind(this)}
                />
            </div>
        );
    }
}

export default DebugChatMessages;
