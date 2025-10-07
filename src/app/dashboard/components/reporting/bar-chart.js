import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const CustomShape = props => {
  const { x, y, width, height, background, color } = props;

  return (
    <g>
      <rect {...background} fill={color} opacity={0.2} />
      <rect {...{ x, y, width, height }} fill={color} />
    </g>
  );
};

const DashboardBarChart = ({ data, title, topQualifications }) => {
  let cData = [];

  if (topQualifications) {
    topQualifications.map((info, index) => {
      cData.push({
        name: info.title,
        v: info.progress_percentage,
        color: data[index] ? data[index].color : '#F5A623'
      });
    });
  }
  return (
    <div className="dashboard-bar-chart box chart-block">
      <div className="block-header">
        <h4 className="opensans-semibold">{title}</h4>
        <a className="is-primary">{/* <i className="fa fa-pencil" /> */}</a>
      </div>
      <div className="block-content">
        <div className="chart-container" style={{ height: '220px' }}>
          {cData && (
            <ResponsiveContainer>
              <BarChart
                data={cData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <YAxis axisLine={false} tickMargin={10} />
                <XAxis dataKey="name" tickMargin={10} axisLine={false} />
                <Bar dataKey="v" shape={<CustomShape />} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* <ul className="p-legends">
          {cData &&
            cData.map((entry, index) => (
              <li key={`p-i-${index}`}>
                <div
                  className="p-color"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="p-label">{entry.name}</div>
              </li>
            ))}
        </ul> */}
      </div>
    </div>
  );
};

DashboardBarChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string
};

DashboardBarChart.defaultProps = {
  data: [
    { name: 'Bill Smith', v: 2400, color: '#CA3A89' },
    { name: 'Lynn Barris', v: 1398, color: '#007FA3' },
    { name: 'Robert Smith', v: 2000, color: '#84BC02' },
    { name: 'James Wilkinson', v: 2780, color: '#F5A623' }
  ],
  title: 'Top Performing Qualification'
};

export default DashboardBarChart;
