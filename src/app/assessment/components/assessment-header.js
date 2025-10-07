import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import * as lodash from 'lodash';

import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';

const {
  components: { ExpandableButton, CloudinaryMedia },
  util: {
    helpers: { UserAccess }
  }
} = common;
const { SuperAdmin, SiteAdmin, CentreAdmin } = Roles;

class AssessmentHeader extends Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    // browserHistory.replace('/assessment/assessment-progress');
    browserHistory.goBack();
  }

  render() {
    const { member, qualification, showDownloadCV, bgColor } = this.props;
    const image = lodash.get(member, 'cloudinary_file_id');
    const dimensions = 120;

    return (
      <section
        className="content-section hero smaller gray"
        style={{ backgroundColor: bgColor }}
      >
        {/* General header */}

        <div className="hero-body">
          <div className="container assessment-header">
            <button
              className="back button is-primary is-outlined column m-r-30 flex-none"
              onClick={this.goBack}
            >
              <i className="fa fa-angle-left" />
            </button>

            {member ? (
              <div className="is-flex">
                <div className="photo">
                  {image && <img src={image} alt="" />}
                </div>
                <div className="p-l-20">
                  <div
                    className="subtitle"
                    style={{ color: bgColor ? '#ffffff' : 'inherit' }}
                  >
                    {lodash.get(member, 'screen_name', '')}
                  </div>
                  <div style={{ color: bgColor ? '#ffffff' : 'inherit' }}>
                    <div>
                      Qualification: {lodash.get(qualification, 'title', '')}
                    </div>
                    <div>DDB: {lodash.get(member, 'join_date', '')}</div>
                    <div>
                      Location: {lodash.get(member, 'town_city', '')}{' '}
                      {lodash.get(member, 'address_line_1', '')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="subtitle">Assessment Progress</div>
            )}

            {showDownloadCV && (
              <button
                className="button flex-none"
                style={{
                  marginLeft: 'auto',
                  background: '#127FA1',
                  color: 'white'
                }}
                onClick={this.goBack}
              >
                <span
                  className="semibold"
                  style={{ transform: 'rotate(90deg)' }}
                >
                  ...
                </span>
                <span className="semibold">Download CV</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }
}

AssessmentHeader.propTypes = {
  qualification: PropTypes.object,
  showDownloadCV: PropTypes.bool
};

AssessmentHeader.defaultProps = {
  qualification: null,
  showDownloadCV: true
};

export default AssessmentHeader;
