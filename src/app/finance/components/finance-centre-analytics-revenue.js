import React from 'react';
import classNames from 'classnames';
import common from 'app/common';
import CurrencyFormat from 'react-currency-format';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import * as lodash from 'lodash';

import config from 'brand/config';
import { Text, Unit } from 'app/intl';

class CentreAnalyticsRevenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { centre } = this.props;

    const total_revenue = lodash.get(centre, 'total_revenue') || 0;

    const monthly_revenue = [
      {
        tracker_group_id: 1,
        parent_id: 0,
        title: 'Jan',
        alias: 'e_learning',
        total_time_spent: 100
      },
      {
        tracker_group_id: 1,
        parent_id: 0,
        title: 'Feb',
        alias: 'e_learning',
        total_time_spent: 500
      },
      {
        tracker_group_id: 1,
        parent_id: 0,
        title: 'Mar',
        alias: 'e_learning',
        total_time_spent: 300
      },
      {
        tracker_group_id: 1,
        parent_id: 0,
        title: 'Apr',
        alias: 'e_learning',
        total_time_spent: 200
      },
      {
        tracker_group_id: 1,
        parent_id: 0,
        title: 'May',
        alias: 'e_learning',
        total_time_spent: 500
      }
    ];

    return (
      <div className="is-flex" style={{ padding: '1.5rem', width: '100%' }}>
        <div className="fiance-revenue-card total-revenue">
          <div className="semibold p-b-5 border-bottom">Total Revenue</div>
          <div className="title m-t-45">
            <CurrencyFormat
              value={total_revenue}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'£'}
              renderText={value => <span>{value}</span>}
            />
          </div>
        </div>

        <div className="fiance-revenue-card monthly-revenue">
          <div className="semibold p-b-5 border-bottom">Monthly Revenue</div>
          <div className="m-t-15" style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer>
              <LineChart
                data={monthly_revenue}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total_time_spent"
                  stroke="#75B742"
                  strokeWidth={2}
                  fill="white"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default CentreAnalyticsRevenue;
