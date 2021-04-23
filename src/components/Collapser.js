/* @flow */
import React from "react";
import classnames from "classnames";

import Link from "./Link";

type Props = {
    message: string,
    className?: string,
    closeMessage?: string,
    expanded?: boolean,
    children?: any,
    onClick?: Function
}

type State = {
    collapsed: boolean,
}

class Collapser extends React.Component<Props, State> {
    constructor(props: Object) {
        // By default, if 'closeMessage' is not defined, then
        // the component will remove the expand link on click, and the user
        // will not be able to hide the expanded content.
        // If 'closeMessage' is defined, then the component will provide a
        // close link that will collapse an expanded Collapser.
        super(props);

        // This component renders
        // open on the server, then
        // collapses its content if JS is available.
        this.state = {collapsed: false};
    }

    componentDidMount(): void {
        this.setState({collapsed: !this.props.expanded});
    }

    static sampleProps = {
        default: {
            message: "Click to expand",
            children: (
                <div>Hidden content</div>
            ),
        },
        expanded: {
            expanded: true,
            message: "Click to expand",
            children: (
                <div>Expanded content</div>
            ),
        },
    };

    onClick(event: SyntheticInputEvent<>): void {
        if (this.state.collapsed) {
            event.preventDefault();
            this.setState({collapsed: false});
            this.props.onClick && this.props.onClick();
        } else if (this.props.closeMessage) {
            event.preventDefault();
            this.setState({collapsed: true});
            this.props.onClick && this.props.onClick();
        }
    }

    render() {
        return (
            <div
                className={classnames(
                    "Collapser",
                    this.props.className,
                    {collapsed: this.state.collapsed}
                )}
                onClick={this.onClick.bind(this)}
            >
                {this.renderMessage()}
                <div
                    className={classnames({collapsed: this.state.collapsed})}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

    renderMessage() {
        if (this.state.collapsed) {
            return (
                <Link
                    to="#"
                    alt="Show more"
                    className="collapser-message"
                    role="button"
                >
                    {this.props.message}
                </Link>
            );
        } else if (this.props.closeMessage) {
            return (
                <Link
                    to="#"
                    alt="Show less"
                    className="collapser-message"
                    role="button"
                >
                    {this.props.closeMessage}
                </Link>
            );
        }
    }
}

export default Collapser;
