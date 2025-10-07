import React from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DashboardAreaChart = ({ data, title, monthlyTopQualifications }) => {
  let cData = [];

  if (monthlyTopQualifications) {
    let result = Object.keys(monthlyTopQualifications).map(function(key) {
      return { month: key, info: monthlyTopQualifications[key] };
    });
    result.map(d => {
      cData.push({
        month: d.month,
        a: d.info[0] && d.info[0].learners,
        b: d.info[1] && d.info[1].learners,
        c: d.info[2] && d.info[2].learners
      });
    });
  }
  return (
    <div className="dashboard-area-chart box chart-block">
      <div className="block-header">
        <h4 className="opensans-semibold">{title}</h4>
        <a className="is-primary">{/* <i className="fa fa-pencil" /> */}</a>
      </div>
      <div className="block-content p-t-20 p-b-10">
        {cData && (
          <ResponsiveContainer>
            <AreaChart
              data={cData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <YAxis axisLine={false} tickLine={false} />
              <XAxis
                dataKey="month"
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <CartesianGrid vertical={false} stroke="#ddd" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="a"
                stroke="#A02B7E"
                fill="#A02B7E"
              />
              <Area
                type="monotone"
                dataKey="b"
                stroke="#00AEA6"
                fill="#00AEA6"
              />
              <Area
                type="monotone"
                dataKey="c"
                stroke="#D4CE12"
                fill="#D4CE12"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

DashboardAreaChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string
};

DashboardAreaChart.defaultProps = {
  data: [
    { month: '2015.01', a: 4000, b: 2400, c: 2400 },
    { month: '2015.02', a: 3000, b: 1398, c: 2210 },
    { month: '2015.03', a: 2000, b: 9800, c: 2290 },
    { month: '2015.04', a: 2780, b: 3908, c: 2000 },
    { month: '2015.05', a: 1890, b: 4800, c: 2181 },
    { month: '2015.06', a: 2390, b: 3800, c: 2500 },
    { month: '2015.07', a: 3490, b: 4300, c: 2100 }
  ],
  title: 'Learner Volumes'
};

export default DashboardAreaChart;
