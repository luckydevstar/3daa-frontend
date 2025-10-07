import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

class DashboardPieChart extends Component {
  render() {
    const { data, title, topCentres } = this.props;
    let cData = [];

    if (topCentres) {
      topCentres.map((info, index) => {
        cData.push({
          name: info.centre_name,
          value: info.total,
          color: data[index] ? data[index].color : '#FFBB28',
          reg_number: info.centre_number
        });
      });
    }
    return (
      <div className="dashboard-pie-chart box chart-block">
        <div className="block-header">
          <h4 className="opensans-semibold">{title}</h4>
          <a className="is-primary">{/* <i className="fa fa-pencil" /> */}</a>
        </div>
        <div className="columns block-content">
          <div className="column is-6">
            <ul className="p-legends">
              {cData &&
                cData.map((entry, index) => (
                  <li key={`p-i-${index}`}>
                    <div
                      className="p-color"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="p-label">
                      <p className="opensans-semibold">{entry.name}</p>
                      <p className="reg-number">{`Registration Number: ${
                        entry.reg_number
                      }`}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="column">
            {cData && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cData}
                    dataKey={'value'}
                    labelLine={false}
                    innerRadius={'35%'}
                    fill="#8884d8"
                  >
                    {cData.map((entry, index) => (
                      <Cell key={`p-c-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    );
  }
}

DashboardPieChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string
};

DashboardPieChart.defaultProps = {
  data: [
    { name: 'Group A', value: 400, color: '#825AA4' },
    { name: 'Group B', value: 300, color: '#00B4BC' },
    { name: 'Group D', value: 200, color: '#7ED321' }
  ],
  title: 'Top Centres'
};

export default DashboardPieChart;
