import React from 'react';

import DataPicker1 from './data-picker-1';
import DataPicker2 from './data-picker-2';

import IconChartGauge from 'images/icon_chart_gauge.svg';
import IconChartLine from 'images/icon_chart_line.svg';
import IconChartBars from 'images/icon_chart_bars.svg';
import IconChartArea from 'images/icon_chart_area.svg';

const DataPickerDialogContent = () =>
  <div className="chart-dialog-content">
    <div className="columns header">
      <div className="column">
        <h1>Pick Chart Data</h1>
      </div>
      <div className="column has-text-right">
        <button className="button is-primary add-chart">Add</button>
      </div>
    </div>
    <div className="data-pickers">
      <DataPicker2 icon={IconChartGauge} title="Gauge" color="#f5a623" />
      <DataPicker2 icon={IconChartLine} title="Line" color="#029c86" />
      <DataPicker1 icon={IconChartBars} title="Columns" />
      <DataPicker1 icon={IconChartArea} title="Streamgraph" />
    </div>
  </div>;

export default DataPickerDialogContent;
