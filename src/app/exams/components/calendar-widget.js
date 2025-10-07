import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class CalendarWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendar: [],
      weekHeader: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };
  }

  UNSAFE_componentWillMount() {
    this.generateCalendar();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.month !== this.props.month ||
      nextProps.year !== this.props.year
    ) {
      this.generateCalendar();
    }
  }

  generateCalendar() {
    const { year, month, eventDates } = this.props;

    const hasEvents = d => {
      return !eventDates.every(ed => {
        const date = new Date(ed);
        return (
          date.getFullYear() !== d.getFullYear() ||
          date.getMonth() !== d.getMonth() ||
          date.getDate() !== d.getDate()
        );
      });
    };

    const first = new Date(year, month, 1);
    const fd = first.getDay();
    const date = new Date(year, month, 1 - fd);
    const list = [];
    for (let i = 0; i < 35; i++) {
      const d = date.getDate();
      list.push({
        date: d,
        events: hasEvents(date)
      });
      date.setDate(d + 1);
    }
    const calendar = [];
    for (let i = 0; i < 5; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        week.push(list[i * 7 + j]);
      }
      calendar.push(week);
    }
    this.setState({ calendar });
  }

  render() {
    const {
      month,
      years,
      months,
      isYearView,
      isMonthView,
      monthChange,
      handleYearView
    } = this.props;
    const { calendar, weekHeader } = this.state;
    const currentDate = new Date().getDate();

    if (isYearView) {
      return (
        <div className="calendar-widget">
          <div className="row row-months">
            {years.map((item, i = 1) => (
              <div
                key={`month-${i}`}
                className={cx('cell')}
                onClick={() => handleYearView(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isMonthView) {
      return (
        <div className="calendar-widget">
          <div className="row row-months">
            {months.map(item => (
              <div
                key={`month-${item.value}`}
                className={cx('cell', { selected: item.value === month })}
                onClick={() => monthChange(item.value)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="calendar-widget">
        <div className="row">
          {weekHeader.map(header => (
            <div key={`wh-${header}`} className="cell">
              {header}
            </div>
          ))}
        </div>
        {calendar.map((week, i) => (
          <div
            key={`week-${i}`}
            className={cx('row days-digit', { overflowY: 'scroll' })}
          >
            {week.map((cell, j) => (
              <div
                key={`d-${i}-${j}`}
                className={cx('cell', { selected: cell.date === currentDate })}
              >
                {cell.date}
                {cell.events ||
                  ((Math.floor(Math.random() * i) + 1) % 2 === 0 && (
                    <i className="fa fa-circle" />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

CalendarWidget.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  eventDates: PropTypes.array,
  months: PropTypes.array.isRequired,
  isYearView: PropTypes.bool.isRequired,
  isMonthView: PropTypes.bool.isRequired,
  handleYearView: PropTypes.func.isRequired
};

CalendarWidget.defaultProps = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  eventDates: ['2018-1-10', '2018-1-12']
};

export default CalendarWidget;
