import React from 'react';
import PropTypes from 'prop-types';
import ISvg from 'react-inlinesvg';
import cx from 'classnames';
import common from 'app/common';

import IconGauge from 'images/icon_chart_gauge.svg';
import IconLineChart from 'images/icon_chart_line.svg';
import IconPieChart from 'images/icon_chart_pie.svg';
import IconAreaChart from 'images/icon_chart_area.svg';
import IconColumnsChart from 'images/icon_chart_bars.svg';
import IconMinMaxChart from 'images/icon_chart_min_max.svg';
import IconStreamChart from 'images/icon_chart_stream.svg';

const { noop } = common.util.helpers;

const AddChartDialogContent = ({ chartsToAdd, toggleChartsToAdd, onAdd }) =>
  <div className="chart-dialog-content">
    <div className="columns header">
      <div className="column">
        <h1>Choose a chart</h1>
      </div>
      <div className="column has-text-right">
        <button className="button is-primary add-chart" onClick={onAdd}>
          Add
        </button>
      </div>
    </div>
    <div className="columns is-multiline p-20">
      <div className="column is-4">
        <div
          className={cx('box', { selected: chartsToAdd.gauge })}
          onClick={() => toggleChartsToAdd('gauge')}
        >
          <ISvg src={IconGauge} />
          <span>Gauge</span>
        </div>
      </div>
      <div className="column is-4">
        <div
          className={cx('box line', { selected: chartsToAdd.line })}
          onClick={() => toggleChartsToAdd('line')}
        >
          <ISvg src={IconLineChart} />
          <span>Line</span>
        </div>
      </div>
      <div className="column is-4">
        <div
          className={cx('box', { selected: chartsToAdd.pie })}
          onClick={() => toggleChartsToAdd('pie')}
        >
          <ISvg src={IconPieChart} />
          <span>Pie</span>
        </div>
      </div>
      <div className="column is-4">
        <div
          className={cx('box', { selected: chartsToAdd.area })}
          onClick={() => toggleChartsToAdd('area')}
        >
          <ISvg src={IconAreaChart} />
          <span>Area</span>
        </div>
      </div>
      <div className="column is-4">
        <div
          className={cx('box', { selected: chartsToAdd.columns })}
          onClick={() => toggleChartsToAdd('columns')}
        >
          <ISvg src={IconColumnsChart} />
          <span>Columns</span>
        </div>
      </div>
      <div className="column is-4">
        <div
          className={cx('box', { selected: chartsToAdd.minmax })}
          onClick={() => toggleChartsToAdd('minmax')}
        >
          <ISvg src={IconMinMaxChart} />
          <span>min-max</span>
        </div>
      </div>
      <div className="column is-4">
        <div
          className={cx('box', { selected: chartsToAdd.stream })}
          onClick={() => toggleChartsToAdd('stream')}
        >
          <ISvg src={IconStreamChart} />
          <span>Streamgraph</span>
        </div>
      </div>
    </div>
  </div>;

AddChartDialogContent.propTypes = {
  chartsToAdd: PropTypes.object,
  toggleChartsToAdd: PropTypes.func,
  onAdd: PropTypes.func
};

AddChartDialogContent.defaultProps = {
  chartsToAdd: {},
  toggleChartsToAdd: noop,
  onAdd: noop
};

export default AddChartDialogContent;
