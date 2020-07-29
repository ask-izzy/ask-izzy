import posthog from "posthog-js";
import React from "react"

// Use existing appvars var LOCAL_FILE_ENCRYPTION_KEY until it is decided that
// PostHog is worth using. Then commission PostHog specific variable
if (typeof window !== "undefined" && window.LOCAL_FILE_ENCRYPTION_KEY) {
  const posthogCreds = window.LOCAL_FILE_ENCRYPTION_KEY.split("~");
  posthog.init(posthogCreds[0], { 
    api_host: posthogCreds[1],
    // posthog.people.set() appears to be necessary to set default properties
    // (like browser) for user
    loaded: posthog => {posthog.people.set(); posthog.identify()}
  });
}

function setFeatureFlags(WrappedComponent) {
  class FeatureFlagSetter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        siteFeatureFlags: {}
      };
    }

    componentDidMount () {
      if (typeof window === "undefined") {
        return 
      }

      posthog.onFeatureFlags(() => {
        this.setState({
          siteFeatureFlags: Object.assign(
            {},
            ...posthog.feature_flags.getFlags()
              .map((flag) => ({ [flag]: posthog.isFeatureEnabled(flag) }))
          )
        });
      });
    }

    render () {
      const {forwardedRef, ...props} = this.props;
      return <WrappedComponent {...props} {...this.state} ref={forwardedRef} />;
    }
  };

  return React.forwardRef((props, ref) => {    
    return <FeatureFlagSetter {...props} forwardedRef={ref} />;  
  });
}

export default {
  setFeatureFlags,
  client: posthog,
};
