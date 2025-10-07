import React from 'react';
import PropTypes from 'prop-types';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const SalesTable = ({ data, title, adminOrdersMonthly }) => {
  let cData = [];

  if (adminOrdersMonthly && adminOrdersMonthly.orders) {
    let orders = adminOrdersMonthly.orders.asMutable();
    let result = Object.keys(orders).map(function(key) {
      return { month: key, info: orders[key] };
    });
    result.map(d => {
      cData.push({
        name: d.month,
        v: d.info.total_revenue
      });
    });
  }
  console.log(cData);
  return (
    <div className="dashboard-sales-table box chart-block">
      <div className="block-header">
        <h4 className="opensans-semibold">{title}</h4>
      </div>
      {adminOrdersMonthly && (
        <div className="block-content">
          <div className="sales-chart">
            {cData && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cData} margin={{ right: 30, top: 10 }}>
                  <YAxis
                    domain={[0, 100]}
                    tickMargin={20}
                    axisLine={false}
                    tickLine={{ stroke: '#ccc' }}
                  />
                  <XAxis
                    dataKey="name"
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <CartesianGrid stroke="#ddd" />
                  <Line
                    type="linear"
                    dataKey="v"
                    stroke="#029c86"
                    fill="#029c86"
                    strokeWidth="2"
                    dot={{ stroke: '#029c86', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="sales-table">
            <div className="columns">
              <div className="column opensans-semibold">
                {adminOrdersMonthly.total_revenue &&
                  `£${adminOrdersMonthly.total_revenue}`}
              </div>
              <div className="column small">Total Sales</div>
              <div className="column opensans-semibold">
                {adminOrdersMonthly.total_today &&
                  `£${adminOrdersMonthly.total_today.total_revenue}`}
              </div>
              <div className="column small">Sales Today</div>
            </div>
            <div className="columns">
              <div className="column is-6">&nbsp;</div>
              <div className="column opensans-semibold">
                {adminOrdersMonthly.total_yesterday &&
                  `£${adminOrdersMonthly.total_yesterday.total_revenue}`}
              </div>
              <div className="column small">Sales Yesterday</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SalesTable.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string
};

SalesTable.defaultProps = {
  data: [
    { name: 'Bill Smith', v: 2400, color: '#CA3A89' },
    { name: 'Lynn Barris', v: 1398, color: '#007FA3' },
    { name: 'Robert Smith', v: 2000, color: '#84BC02' },
    { name: 'James Wilkinson', v: 2780, color: '#F5A623' }
  ],
  title: 'Sales - Last 12 Months'
};

export default SalesTable;
