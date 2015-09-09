/* @flow */
import React from "react";

class Collapser extends React.Component {

    // flow:disable not supported yet
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

    handleClick(event: SyntheticInputEvent): void {
        event.preventDefault();
        this.setState({collapsed: !this.state.collapsed});
    }

    hiddenClass(): string {
        if (this.state.collapsed) {
            return "collapsed";
        }

        return "";
    }

    render(): React.Element {
        return (
            <div
                className="Collapser"
                onclick={this.handleClick.bind(this)}
            >
                <a
                    href="#"
                    alt="Show more"
                    onClick={this.handleClick.bind(this)}
                >{this.props.message}</a>
                <div
                    className={ this.hiddenClass() }
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default Collapser;
