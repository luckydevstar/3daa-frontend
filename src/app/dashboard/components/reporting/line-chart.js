import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import common from 'app/common';
import DataPicker2 from './data-picker-2';
import IconChartLine from 'images/icon_chart_line.svg';

const { ContentModalNew } = common.components;

class DashboardLineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      color: props.color
    };
    this.openEditorModal = this.openEditorModal.bind(this);
    this.closeEditorModal = this.closeEditorModal.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  openEditorModal() {
    this.setState({
      editing: true
    });
  }

  closeEditorModal() {
    this.setState({
      editing: false
    });
  }

  handleColorChange(color) {
    this.setState({ color });
  }

  render() {
    const { title, dailyLogins } = this.props;
    const { editing, color } = this.state;

    let data = [];
    if (dailyLogins) {
      data = [
        { name: 'Mon', v: dailyLogins.Mon },
        { name: 'Tue', v: dailyLogins.Tue },
        { name: 'Wed', v: dailyLogins.Wed },
        { name: 'Thu', v: dailyLogins.Thu },
        { name: 'Fri', v: dailyLogins.Fri },
        { name: 'Sat', v: dailyLogins.Sat },
        { name: 'Sun', v: dailyLogins.Sun }
      ];
    }

    return (
      <div className="dashboard-l-chart box chart-block">
        <div className="block-header">
          <h4 className="opensans-semibold">{title}</h4>
          {/* <a className="is-primary" onClick={this.openEditorModal}>
            <i className="fa fa-pencil" />
          </a> */}
        </div>
        <div className="block-content p-t-20 p-b-20">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ right: 30, top: 10 }}>
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
                <CartesianGrid vertical={false} stroke="#ddd" />
                <Line
                  type="linear"
                  dataKey="v"
                  stroke="#029c86"
                  fill={color}
                  strokeWidth="2"
                  dot={{ stroke: '#029c86', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <ContentModalNew
          className="chart-dialog-content"
          isOpened={editing}
          onClose={this.closeEditorModal}
        >
          <DataPicker2
            icon={IconChartLine}
            title="Line"
            color={color}
            onColorChange={this.handleColorChange}
          />
        </ContentModalNew>
      </div>
    );
  }
}

DashboardLineChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  color: PropTypes.string
};

DashboardLineChart.defaultProps = {
  data: [
    { name: 'Mon', v: 40 },
    { name: 'Tue', v: 10 },
    { name: 'Wed', v: 50 },
    { name: 'Thu', v: 30 },
    { name: 'Fri', v: 90 }
  ],
  title: 'Daily Login',
  color: '#029c86'
};

export default DashboardLineChart;
