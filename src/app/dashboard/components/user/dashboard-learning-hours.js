import React from 'react';
import classNames from 'classnames';
import {
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import config from 'brand/config';

const {
  components: { ProgressBadge }
} = common;

import IconLearningHours from 'images/icon-learning-hours.svg';

const DashboardLearningHours = ({ isChartView }) => {
  const data = [
    { name: '5 JAN', uv: 4000, pv: 2400, amt: 2400 },
    { name: '10 JAN', uv: 3000, pv: 1398, amt: 2210 },
    { name: '15 JAN', uv: 2000, pv: 9800, amt: 2290 },
    { name: '20 JAN', uv: 2780, pv: 3908, amt: 2000 },
    { name: '25 JAN', uv: 1890, pv: 4800, amt: 2181 },
    { name: '30 JAN', uv: 2390, pv: 3800, amt: 2500 },
    { name: '5 FEB', uv: 3490, pv: 4300, amt: 2100 }
  ];
  return (
    <div className="your-learning-hours">
      <div className="chart-details p-t-15">
        <div className="columns">
          <div className={classNames('column', { 'is-4': isChartView })}>
            <div className="columns">
              <div className="column is-2 has-text-right p-t-20">
                <Isvg src={IconLearningHours} />
              </div>
              <div className="column is-10 total-hours">
                <p>Total Learning hours | 48.9hrs</p>
                <p>Units Completed: 2</p>
              </div>
            </div>
          </div>
          {isChartView && (
            <div className="column is-8">
              <div className="columns">
                <div className="column learning-hour">
                  <div className="title">Profile CV</div>
                  <div className="badge">
                    <ProgressBadge
                      dimensions={50}
                      strokeWidth={3}
                      percentage={12}
                      strokeColorSecondary="rgba(0, 0, 0, .1)"
                      percentageFontSize={14}
                      label="12.5 hrs"
                    />
                  </div>
                </div>
                <div className="column learning-hour">
                  <div className="title">Videos</div>
                  <div className="badge">
                    <ProgressBadge
                      dimensions={50}
                      strokeWidth={3}
                      percentage={12}
                      strokeColorSecondary="rgba(0, 0, 0, .1)"
                      percentageFontSize={14}
                      label="0.5 hrs"
                    />
                  </div>
                </div>
                <div className="column learning-hour">
                  <div className="title">Activities</div>
                  <div className="badge">
                    <ProgressBadge
                      dimensions={50}
                      strokeWidth={3}
                      percentage={12}
                      strokeColorSecondary="rgba(0, 0, 0, .1)"
                      percentageFontSize={14}
                      label="3.2 hrs"
                    />
                  </div>
                </div>
                <div className="column learning-hour">
                  <div className="title">Workbooks</div>
                  <div className="badge">
                    <ProgressBadge
                      dimensions={50}
                      strokeWidth={3}
                      percentage={12}
                      strokeColorSecondary="rgba(0, 0, 0, .1)"
                      percentageFontSize={14}
                      label="32.1 hrs"
                    />
                  </div>
                </div>
                <div className="column learning-hour">
                  <div className="title">News</div>
                  <div className="badge">
                    <ProgressBadge
                      dimensions={50}
                      strokeWidth={3}
                      percentage={12}
                      strokeColorSecondary="rgba(0, 0, 0, .1)"
                      percentageFontSize={14}
                      label="0.5 hrs"
                    />
                  </div>
                </div>
                <div className="column learning-hour">
                  <div className="title">Chat</div>
                  <div className="badge">
                    <ProgressBadge
                      dimensions={50}
                      strokeWidth={3}
                      percentage={12}
                      strokeColorSecondary="rgba(0, 0, 0, .1)"
                      percentageFontSize={14}
                      label="0.1 hrs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="chart">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke={config.primaryColor}
              strokeWidth={3}
              fill={config.primaryColor}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardLearningHours;
