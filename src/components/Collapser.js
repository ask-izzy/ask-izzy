/* @flow */
import React from "react";

class Collapser extends React.Component {

    constructor(props: Object) {
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

    hiddenClass(): string {
        if (this.state.collapsed) {
            return "collapsed";
        }

        return "";
    }

    onClick(event: SyntheticInputEvent): void {
        if (this.state.collapsed) {
            event.preventDefault();
            this.setState({collapsed: false});
        }
    }

    onMessageClick(event: SyntheticInputEvent): void {
        if (this.props.allowReclosing) {
            event.preventDefault();
            this.setState({collapsed: !this.state.collapsed});
        } else {
            this.onClick(event);
        }
    }

    render(): ReactElement {
        return (
            <div
                className={`Collapser ${this.props.className || ""}`}
                onClick={this.onClick.bind(this)}
            >
                <a
                    href="#"
                    alt="Show more"
                    className="collapser-message"
                    onClick={this.onMessageClick.bind(this)}
                >{this.props.message}</a>
                <div
                    className={this.hiddenClass()}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default Collapser;
