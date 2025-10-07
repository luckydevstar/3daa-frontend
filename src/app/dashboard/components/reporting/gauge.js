import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import common from 'app/common';
import DataPicker2 from './data-picker-2';
import IconChartGauge from 'images/icon_chart_gauge.svg';

const { ContentModalNew } = common.components;

class DashboardGauge extends Component {
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
    const { title, monthlyLearningHours } = this.props;
    const { editing, color } = this.state;

    const percent = monthlyLearningHours ? monthlyLearningHours.total : 0;

    return (
      <div className="dashboard-gauge box chart-block">
        <div className="block-header">
          <h4 className="opensans-semibold">{title}</h4>
          {/* <a className="is-primary" onClick={this.openEditorModal}>
            <i className="fa fa-pencil" />
          </a> */}
        </div>
        <div className="block-content">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 100 }]}
                dataKey="value"
                innerRadius="80%"
                outerRadius="180%"
                cy="100%"
                isAnimationActive={false}
                startAngle={180}
                endAngle={0}
                fill="#eee"
              />
              <Pie
                data={[{ value: percent }]}
                dataKey="value"
                innerRadius="80%"
                outerRadius="180%"
                cy="100%"
                startAngle={180}
                endAngle={1.8 * (100 - percent)}
                fill={color}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="gauge-label">{percent}%</div>
        </div>
        <ContentModalNew
          className="chart-dialog-content"
          isOpened={editing}
          onClose={this.closeEditorModal}
        >
          <DataPicker2
            icon={IconChartGauge}
            title="Gauge"
            color={color}
            onColorChange={this.handleColorChange}
          />
        </ContentModalNew>
      </div>
    );
  }
}

DashboardGauge.propTypes = {
  percent: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.string
};

DashboardGauge.defaultProps = {
  percent: 80,
  title: 'Monthly Learning Hours',
  color: '#f5a623'
};

export default DashboardGauge;
