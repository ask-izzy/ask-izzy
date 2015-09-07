/* @flow */
import React from "react";

class Collapser extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        message: "Click to expand",
        children: (
            <div>Hidden content</div>
        ),
    };

    constructor(props: Object) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        // This component renders
        // open on the server, then
        // collapses its content if JS is available.
        this.state = {collapsed: false};
    }

    handleClick(event: SyntheticInputEvent): void {
        this.setState({collapsed: !this.state.collapsed});
    }

    componentDidMount(): void {
        this.setState({collapsed: true});
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
                onclick={this.handleClick}
            >
                <a
                    alt="Show more"
                    onClick={this.handleClick}
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
