/* @flow */
import * as React from "react";

type Props = {
    children?: any,
    footerContents: React.Node
}

class WithStickyFooter extends React.Component<Props> {
    #onscreenIndicatorRef: {current: null | React.ElementRef<'div'>} =
        React.createRef()
    #footerRef: {current: null | React.ElementRef<'footer'>} = React.createRef()
    // This should be type "IntersectionObserver | null" but for some reason
    // that causes eslint to bork
    // $FlowIgnore
    #overlapObserver = null

    componentDidMount(): void {
        if (window.IntersectionObserver) {
            this.#overlapObserver = new IntersectionObserver(
                ([event]) => this.#footerRef?.current?.toggleAttribute(
                    "floating", event.intersectionRatio < 1
                ),
                {
                    threshold: [1],
                }
            );

            if (this.#onscreenIndicatorRef.current) {
                this.#overlapObserver.observe(
                    this.#onscreenIndicatorRef.current
                );
            }
        }
    }

    componentWillUnmount(): void {
        this.#overlapObserver?.disconnect()
    }

    render(): React.Element<"div"> {
        return (
            <div
                className="WithStickyFooter"
            >
                <div className="content">
                    {this.props.children}
                </div>
                <footer ref={this.#footerRef}>
                    {this.props.footerContents}
                </footer>
                <div
                    className="onscreenIndicator"
                    ref={this.#onscreenIndicatorRef}
                />
            </div>
        );
    }
}

export default WithStickyFooter;
