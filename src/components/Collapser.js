/* @flow */
import React from "react";
import classnames from "classnames";

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

    onClick(event: SyntheticInputEvent): void {
        if (this.state.collapsed) {
            event.preventDefault();
            this.setState({collapsed: false});
            this.props.onClick && this.props.onClick();
        }
    }

    render(): ReactElement {
        return (
            <div
                className={classnames("Collapser", this.props.className)}
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

    renderMessage(): ?ReactElement {
        if (this.state.collapsed) {
            return (
                <a
                    href="#"
                    alt="Show more"
                    className="collapser-message"
                    role="button"
                >
                    {this.props.message}
                </a>
            );
        }
    }

}

export default Collapser;
