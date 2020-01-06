/* @flow */

import React from "react";
import PropTypes from "proptypes";
import { Link } from "react-router";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import * as iss from "../../iss";

type Props = {
  onDoneTouchTap: Function,
  name: string,
}

class BushfireResponseAcknowledgement extends Personalisation<Props, {}> {
  static defaultProps = {
    name: "bushfire-response",
  };

  static title = "Bushfire response 2020";

  static getSearch(request: iss.searchRequest): ?iss.searchRequest {
    // Force this component to be shown while bushfire message is active.
    return null;
  }

  render() {
    let bannerName = "";

    try {
      bannerName = this.context.controller.props.params.page;
    } catch (err) {
      // continue with no banner
    }

    return (
      <div>
        <components.HeaderBar
          primaryText="Bushfire response 2020"
          bannerName={bannerName}
        />
        <div className="body">
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
          {this.props.showDoneButton && this.renderDoneButton()}
          {this.renderDoneButton()}
        </div>
      </div>
    );
  }

  renderDoneButton() {
    return (
      <div>
        <div className="done-button">
          <components.FlatButton
            label="I understand"
            autoFocus={true}
            onClick={this.props.onDoneTouchTap}
          />
        </div>
      </div>
    )
  }
}

export default BushfireResponseAcknowledgement;
