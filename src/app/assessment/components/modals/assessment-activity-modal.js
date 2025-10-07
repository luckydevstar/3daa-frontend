import React, { Component } from 'react';
import common from 'app/common';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';

import util from 'app/user/util/';
import { Text, Input } from 'app/intl';

const {
  components: {
    CloudinaryMedia,
    Form: { field, select, radio, textarea },
    Pagination,
    UILoading
  },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      elementAboveHeader,
      UserAccess
    }
  }
} = common;

const imageDimesnions = {
  width: 92,
  height: 92
};

class AssessmentActivityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.isValid = this.isValid.bind(this);
  }

  render() {
    const { evidence } = this.props;

    return (
      <div className="assessment-activity p-t-15">
        <div className="title">Assessment Activity</div>
      </div>
    );
  }
}

const mapStateToProps = ({ profile, persisted }) => ({
  user: lodash.get(profile, 'user')
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentActivityModal);
