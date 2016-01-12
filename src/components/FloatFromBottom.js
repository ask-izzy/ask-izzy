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
                /*
                * Set container height for adding padding to parent
                * to slightly larger than the original object -
                * makes scrolling to bottom of screen feel a bit nicer
                * as you can see that there is definately no more content
                * hidden under the button
                */
                containerHeight = this.refs.container.offsetHeight + 20;
            }
        }

        this.setState({
            containerHeight: containerHeight,
            elementScrolledOffscreen: elementScrolledOffscreen,
        });
    }

    containerHeight(): number {
        return this.state.containerHeight || 0;
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
                {  /*
                    * The following makes the parent element
                    * tall enough when floating the child elements
                    * so that they don't prevent scrolling to the bottom.
                    */
                    this.props.includeOffsetElement && (
                        <div
                            style={{height: this.state.containerHeight}}
                        >
                            &nbsp;
                        </div>
                    )
                }
            </div>
        );
    }

}

export default FloatFromBottom;
