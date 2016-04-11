/* @flow */
import React from "react";
import classnames from "classnames";

// See FloatFromBottom.scss
const floatAnimationDuration = 1000;
// Pad the container so it's obvious that there's no content past the end.
const containerHeightPadding = 20;

class FloatFromBottom extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {containerHeight: 0};
    }

    needExtraPaddingForSmartBar(): boolean {
        if (typeof window == "undefined") {
            return false;
        }

        return window.navigator.userAgent.match(/iPad|iPhone|iPod/);
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
                *
                * In addition, wait until animation is finished
                * before updating height.
                */
                setTimeout(() => this.setState({
                    containerHeight: this.refs.container.offsetHeight +
                        containerHeightPadding,
                }), floatAnimationDuration)
                containerHeight = this.refs.container.offsetHeight +
                    containerHeightPadding;
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
                        smartbarPadding: this.needExtraPaddingForSmartBar(),
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
