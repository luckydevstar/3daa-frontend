import React from 'react';
import classNames from 'classnames';
import common from 'app/common';
import { Link, browserHistory } from 'react-router';
import Isvg from 'react-inlinesvg';
import * as lodash from 'lodash';

import { Text, Unit } from 'app/intl';

const { createCloudinaryUrl } = common.util.helpers;

class CentreAnalyticsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { centre } = this.props;

    const cloudinary_file_id = lodash.get(centre, 'cloudinary_file_id') || '';
    const screen_name = lodash.get(centre, 'screen_name') || 'Centre Name';

    return (
      <div className="finance-centre-analytics-card">
        <div
          className="centre-logo"
          style={{
            background: 'salmon',
            backgroundImage: cloudinary_file_id
              ? `url(${createCloudinaryUrl(cloudinary_file_id, 'image')})`
              : null
          }}
        />

        <div className="centre-analytics-card-content">
          <div className="title p-l-10 p-r-10">{screen_name}</div>

          <div className="columns border-bottom">
            <div className="column">Address</div>
            <div className="column">
              <div>{lodash.get(centre, 'address_line_1') || ''}</div>
              <div>{lodash.get(centre, 'address_line_2') || ''}</div>
            </div>
          </div>

          <div className="columns border-bottom">
            <div className="column">Contact</div>
            <div className="column">
              <div>
                <span>
                  {lodash.get(centre, 'centre_contact_first_name') || ''}
                </span>
                &nbsp;
                <span>
                  {lodash.get(centre, 'centre_contact_last_name') || ''}
                </span>
              </div>
            </div>
          </div>

          <div className="columns border-bottom">
            <div className="column">Tel</div>
            <div className="column">
              <div>{lodash.get(centre, 'contact_number') || ''}</div>
            </div>
          </div>

          <div className="columns border-bottom">
            <div className="column">Students</div>
            <div className="column">
              <div>{lodash.get(centre, 'number_of_learners') || 0}</div>
            </div>
          </div>

          <div className="columns border-bottom">
            <div className="column">Website</div>
            <div className="column">
              <div>{lodash.get(centre, 'website') || ''}</div>
            </div>
          </div>

          <div className="columns border-bottom">
            <div className="column">EQA Assigned</div>
            <div className="column">
              <div>{lodash.get(centre, 'number_of_learners') || 0}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CentreAnalyticsCard;
