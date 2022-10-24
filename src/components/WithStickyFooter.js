/* @flow */
import type {Node as ReactNode} from "react"
import React, {useRef, useEffect} from "react"

type Props = {
    children?: any,
    footerContents: ReactNode
}

function WithStickyFooter({children, footerContents}: Props): ReactNode {

    const onscreenIndicatorRef = useRef()
    const footerRef = useRef()
    let overlapObserver: IntersectionObserver | null = null

    useEffect(() => {
        if (window.IntersectionObserver) {
            overlapObserver = new IntersectionObserver(
                ([event]) => footerRef?.current?.toggleAttribute(
                    "floating", event.intersectionRatio < 1
                ),
                {
                    threshold: [1],
                }
            );

            if (onscreenIndicatorRef.current) {
                overlapObserver.observe(
                    onscreenIndicatorRef.current
                );
            }
        }
        return () => {
            overlapObserver?.disconnect()
        }
    }, [])

    return (
        <div
            className="WithStickyFooter"
        >
            <div className="content">
                {children}
            </div>
            <footer ref={footerRef}>
                {footerContents}
            </footer>
            <div
                className="onscreenIndicator"
                ref={onscreenIndicatorRef}
            />
        </div>
    );
}

export default WithStickyFooter;
