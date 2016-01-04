/* @flow */
import React from "react";
import classnames from "classnames";

class FloatFromBottom extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {containerHeight: 0};
    }

    componentDidMount(): void {
        let elementScrolledOffscreen = false;
        let containerHeight = 0;

        if (this.refs.root) {
            const bottomOfScreen = (window.scrollY + window.innerHeight);
            const topOfElement = this.refs.root.offsetTop

            elementScrolledOffscreen = bottomOfScreen < topOfElement;
            if (elementScrolledOffscreen) {
                containerHeight = this.refs.container.offsetHeight;
            }
        }

        this.setState({
            containerHeight: containerHeight,
            elementScrolledOffscreen: elementScrolledOffscreen,
        });
    }

    render(): ReactElement {
        return (
            <div
                className={classnames(
                    "FloatFromBottom",
                    this.props.className
                )}
                ref="root"
            >
                <div
                    ref="container"
                    className={classnames({
                        floatsFromBottom: this.state.elementScrolledOffscreen,
                    })}
                >
                    {this.props.children}
                </div>
                {/*
                  * The following makes the parent element
                  * tall enough when floating the child elements
                  * so that they don't prevent scrolling to the bottom.
                  */}
                <div
                    style={{height: this.state.containerHeight}}
                >
                    &nbsp;
                </div>
            </div>
        );
    }

}

export default FloatFromBottom;
