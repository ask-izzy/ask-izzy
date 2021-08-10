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

export function setFeatureFlags<Props, Instance>(
    WrappedComponent: React.AbstractComponent<
        {...Props, ...InjectedProps},
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
                                .map((flag) => ({
                                    [flag]: posthog.isFeatureEnabled(flag),
                                }))
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
