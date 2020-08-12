/* @flow */

import posthog from "posthog-js";
import * as React from "react"

const posthogShouldBeLoaded = typeof window !== "undefined" &&
    window.LOCAL_FILE_ENCRYPTION_KEY

// Use existing appvars var LOCAL_FILE_ENCRYPTION_KEY until it is decided that
// PostHog is worth using. Then commission PostHog specific variable
if (posthogShouldBeLoaded) {
    const posthogCreds = window.LOCAL_FILE_ENCRYPTION_KEY.split("~");

    posthog.init(posthogCreds[0], {
        api_host: posthogCreds[1],
        // posthog.people.set() appears to be necessary to set default
        // properties (like browser) for user
        loaded: posthog => {
            posthog.people.set(); posthog.identify()
        },
    });
}

// Wrap given component in HoC which injects any feature flags after they have
// loaded
function injectFeatureFlags<Props>(
    ComponentToWrap: React.AbstractComponent<Props>
): React.AbstractComponent<Props> {
    return React.forwardRef(
        (props, ref) => React.createElement(FeatureFlagSetter, {
            child: ComponentToWrap,
            childProps: {...props, ref},
        })
    )
}

const injectFeatureFlagsComponentCache = new Map()

// For a given component only wrap it with HoC once. Cache on the first call
// and returned the cached wrapped component for future calls.
function cachedInjectFeatureFlags<Props>(
    ComponentToWrap: React.AbstractComponent<Props>
): React.AbstractComponent<Props> {
    let WrappedComponent = injectFeatureFlagsComponentCache.get(ComponentToWrap)

    if (!WrappedComponent) {
        WrappedComponent = this.injectFeatureFlags(ComponentToWrap)
        injectFeatureFlagsComponentCache.set(ComponentToWrap, WrappedComponent)
    }

    return WrappedComponent
}

type InjectedProps = {| siteFeatureFlags: Object |}
class FeatureFlagSetter<Props> extends React.Component<
    {...Props, child: React.AbstractComponent<Props>},
    InjectedProps
> {
    constructor(props) {
        super(props);
        this.state = {
            siteFeatureFlags: {},
        };
    }

    componentDidMount() {
        if (typeof window !== "undefined" && posthogShouldBeLoaded) {
            posthog.onFeatureFlags(() => {
                const flags = posthog.feature_flags.getFlags()
                    .map((flag) => (
                        { [flag]: posthog.isFeatureEnabled(flag) }
                    ))

                this.setState({
                    siteFeatureFlags: Object.assign({}, ...flags),
                });
            });
        }
    }

    render() {
        return React.createElement(this.props.child, {
            ...this.props.childProps,
            siteFeatureFlags: this.state.siteFeatureFlags,
        })
    }
}

export default {
    injectFeatureFlags,
    cachedInjectFeatureFlags,
    client: posthog,
    posthogShouldBeLoaded,
};
