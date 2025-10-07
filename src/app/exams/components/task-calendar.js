import React, { Component } from 'react';

import CustomSideCalendarHeader from './custom-side-calendar-header';
import CalendarWidget from './calendar-widget';

class TaskCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMonthView: false,
      isYearView: false,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.toggleView = this.toggleView.bind(this);
  }

  toggleView() {
    this.setState({
      isMonthView: !this.state.isMonthView,
      isYearView: false
    });
  }

  toggleYearView() {
    this.setState({
      isYearView: !this.state.isYearView,
      isMonthView: !this.state.isYearView
    });
  }

  handleChange(type) {
    if (type === 'left') {
      if (this.state.month > 1) {
        this.setState({
          month: this.state.month - 1
        });
      } else {
        this.setState({
          year: this.state.year - 1,
          month: 12
        });
      }
    }
    if (type === 'right') {
      if (this.state.month !== 12) {
        this.setState({
          month: this.state.month + 1
        });
      } else {
        this.setState({
          year: this.state.year + 1,
          month: 1
        });
      }
    }
  }

  monthChange(value) {
    const { month } = this.state;
    if (value > month) {
      const diff = value - this.state.month;
      this.setState({
        month: this.state.month + diff,
        isMonthView: !this.state.isMonthView
      });
    }

    if (value < month) {
      const diff = this.state.month - value;
      this.setState({
        month: this.state.month - diff,
        isMonthView: !this.state.isMonthView
      });
    }
  }

  handleYearView(value) {
    this.setState({
      year: value,
      isYearView: false
    });
  }

  render() {
    const { months, years } = this.props;
    const { year, month, day } = this.state;
    const date = `${month}-${day}-${year}`;
    return (
      <div className="side-calendar">
        <CustomSideCalendarHeader
          date={date}
          toggle={() => this.toggleView()}
          isYearView={this.state.isYearView}
          toggleYearView={() => this.toggleYearView()}
          handleChange={type => this.handleChange(type)}
        />
        <CalendarWidget
          year={this.state.year}
          month={this.state.month}
          isYearView={this.state.isYearView}
          isMonthView={this.state.isMonthView}
          toggleYearView={() => this.toggleYearView()}
          monthChange={value => this.monthChange(value)}
          handleYearView={value => this.handleYearView(value)}
          {...{
            months,
            years
          }}
        />
      </div>
    );
  }
}

TaskCalendar.defaultProps = {
  months: [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ],
  years: [
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024
  ]
};

export default TaskCalendar;
