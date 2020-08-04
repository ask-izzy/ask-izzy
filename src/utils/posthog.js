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

type InjectedProps = {| siteFeatureFlags: Object |}

function setFeatureFlags<Props, Instance>(
    WrappedComponent: React.AbstractComponent<
        {|...Props, ...InjectedProps |},
        Instance
    >
): React.AbstractComponent<Props, Instance> {
    class FeatureFlagSetter extends React.Component<
        {|...Props, forwardedRef: React.Ref<any>|},
        {siteFeatureFlags: Object}
    > {
        constructor(props) {
            super(props);
            this.state = {
                siteFeatureFlags: {},
            };
        }

        componentDidMount() {
            if (typeof window === "undefined") {
                return
            }

            if (posthogShouldBeLoaded) {
                posthog.onFeatureFlags(() => {
                    this.setState({
                        siteFeatureFlags: Object.assign(
                            {},
                            ...posthog.feature_flags.getFlags()
                                .map((flag) => (
                                    { [flag]: posthog.isFeatureEnabled(flag) }
                                ))
                        ),
                    });
                });
            }
        }

        render() {
            const {forwardedRef, ...props} = this.props;

            return (
                <WrappedComponent {...props}
                    {...this.state}
                    ref={forwardedRef}
                />
            )
        }
    }

    return React.forwardRef((props, ref) => {
        return (
            <FeatureFlagSetter {...props}
                forwardedRef={ref}
            />
        )
    });
}

export default {
    setFeatureFlags,
    client: posthog,
    posthogShouldBeLoaded,
};
