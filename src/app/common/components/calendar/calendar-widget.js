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
    const { calendar, weekHeader } = this.state;
    let currentMonthDates = false;
    return (
      <div className="calendar-widget">
        <div className="row">
          {weekHeader.map(header => (
            <div key={`wh-${header}`} className="cell weekday-labels">
              {header}
            </div>
          ))}
        </div>
        {calendar.map((week, i) => (
          <div key={`week-${i}`} className="row">
            {week.map((cell, j) => {
              if (cell.date === 1) {
                currentMonthDates = !currentMonthDates;
              }
              return (
                <div
                  key={`d-${i}-${j}`}
                  className={cx(
                    'cell',
                    'clickable',
                    !currentMonthDates && 'greyed-out',
                    { selected: cell.events }
                  )}
                >
                  {cell.date}
                  {cell.events && <i className="fa fa-circle" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

CalendarWidget.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  eventDates: PropTypes.array
};

CalendarWidget.defaultProps = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  eventDates: ['2018-1-10', '2018-1-12']
};

export default CalendarWidget;
