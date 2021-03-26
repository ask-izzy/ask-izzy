/* @flow */
import React from "react";
import classnames from "classnames";

// See WithStickyFooter.scss
const floatAnimationDuration = 1000;
// Pad the container so it's obvious that there's no content past the end.
const containerHeightPadding = 20;

type Props = {
    includeOffsetElement?: boolean,
    children?: any,
    className?: string,
}

type State = {
    containerHeight: number,
    elementScrolledOffscreen?: boolean,
}

class WithStickyFooter extends React.Component<Props, State> {
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

    render() {
        return (
            <div
                className={classnames(
                    "WithStickyFooter",
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
                { /*
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

export default WithStickyFooter;
