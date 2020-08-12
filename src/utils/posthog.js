/* @flow */

import posthog from "posthog-js";
import * as React from "react"

export const posthogShouldBeLoaded: boolean = typeof window !== "undefined" &&
    window.POSTHOG_URL && window.POSTHOG_KEY

if (posthogShouldBeLoaded) {
    posthog.init(
        window.POSTHOG_KEY,
        {
            api_host: window.POSTHOG_URL,
            // posthog.people.set() appears to be necessary to set default
            // properties (like browser) for user
            loaded: posthog => {
                posthog.people.set(); posthog.identify()
            },
        }
    );
}

export default posthog

type InjectedProps = {| siteFeatureFlags: Object |}

// Wrap given component in HoC which injects any feature flags after they have
// loaded
export function injectFeatureFlags<Props>(
    ComponentToWrap: React.AbstractComponent<Props>
): React.AbstractComponent<$Diff<Props, InjectedProps>> {
    return React.forwardRef(
        (props, ref) => React.createElement(FeatureFlagSetter, {
            child: ComponentToWrap,
            childProps: props,
            forwardedRef: ref,
        })
    )
}

const injectFeatureFlagsComponentCache = new Map()

// For a given component only wrap it with HoC once. Cache on the first call
// and returned the cached wrapped component for future calls.
export function cachedInjectFeatureFlags<Props>(
    ComponentToWrap: React.AbstractComponent<Props>
): React.AbstractComponent<$Diff<Props, InjectedProps>> {
    let WrappedComponent = injectFeatureFlagsComponentCache.get(ComponentToWrap)

    if (!WrappedComponent) {
        WrappedComponent = this.injectFeatureFlags(ComponentToWrap)
        injectFeatureFlagsComponentCache.set(ComponentToWrap, WrappedComponent)
    }

    return WrappedComponent
}

type State = {| siteFeatureFlags: Object |}
class FeatureFlagSetter<ChildProps> extends React.Component<
    {
        child: React.AbstractComponent<ChildProps & State>,
        childProps: ChildProps,
        forwardedRef: React.Ref<any>
    },
    State
> {
    constructor(props) {
        super(props);
        this.state = {
            siteFeatureFlags: {},
        };
    }

    componentDidMount() {
        if (posthogShouldBeLoaded) {
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
