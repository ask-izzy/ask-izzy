/* @flow */
import * as React from "react";

type Props = {
    children?: any,
    footerContents: React.Node
}

class WithStickyFooter extends React.Component<Props> {
    #onscreenIndicatorRef = React.createRef()
    #footerRef = React.createRef()
    #overlapObserver = null

    componentDidMount(): void {
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

    componentWillUnmount(): void {
        this.#overlapObserver?.disconnect()
    }

    render() {
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
