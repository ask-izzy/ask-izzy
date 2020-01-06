/* @flow */

import * as React from "react";
import BaseStaticPersonalisation from "./BaseStaticPersonalisation";
import storage from "../../storage";
import { Link } from "react-router";

class BushfireResponseAcknowledgement extends BaseStaticPersonalisation {
  doneButtonLabel = "I understand";

  static title = "Bushfire response 2020";

  static defaultProps = Object.assign(
      {},
      BaseStaticPersonalisation.defaultProps,
      {
          name: "bushfire-response",
          heading: "Bushfire response 2020",
      }
  );

  static summaryLabel = "Bushfire response 2020";

  static staticShowPage(): boolean {
      return true;
  }

  static showPage(): boolean {
      return !this.answer;
  }

  onDoneTouchTap(): void {
      storage.setItem(this.props.name, true);

      super.onDoneTouchTap();
  }

  renderContent(): React.Node {
      return (
          <React.Fragment>
              <p>
                  Please be aware that due to the bushfires currently affecting
                  many parts of Australia, some services listed may not be
                  operating or offering a more limited range of services. We are
                  working to update these as soon as possible.
              </p>
              <p>
                  If you are looking for assistance (including food, housing,
                  clothing etc) as a result of the current bushfires, please see
                  our{" "}
                  <Link to="/bushfire-relief">
                      bushfire response page
                  </Link>.
              </p>
          </React.Fragment>
      );
  }
}

export default BushfireResponseAcknowledgement;
