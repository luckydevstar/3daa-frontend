import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ISvg from 'react-inlinesvg';
import uuidv1 from 'uuid/v1';
import { map, filter } from 'ramda';

import common from 'app/common';

import IconPlus from 'images/icon_plus.svg';

const { UISelectDropdown, UIFixedColorPicker } = common.components;

const colors = ['#A02B7E', '#00AEA6', '#D4CE12'];

class DataPicker1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: []
    };
    this.addColumn = this.addColumn.bind(this);
  }

  addColumn() {
    const { columns } = this.state;

    this.setState({
      columns: [
        ...columns,
        {
          key: uuidv1(),
          color: colors[columns.length % colors.length],
          data: ''
        }
      ]
    });
  }

  removeColumn(key) {
    const { columns } = this.state;

    this.setState({
      columns: filter(c => c.key !== key, columns)
    });
  }

  render() {
    const { columns } = this.state;
    const { icon, title, options } = this.props;

    return (
      <div className="data-picker-1 p-30">
        <div className="columns">
          <div className="column is-4">
            <div className="box">
              <ISvg src={icon} />
              <span>
                {title}
              </span>
            </div>
          </div>
          <div className="column">
            <div className="columns">
              <div className="column is-3" />
              <div className="column">
                <div className="label m-b-5">Select Sector</div>
                <UISelectDropdown dropdownList={options} defaultTxt="Select" />
              </div>
            </div>
            <div className="columns">
              <div className="column is-3" />
              <div className="column">
                <div className="label m-b-5">Select Data Display</div>
                <UISelectDropdown dropdownList={options} defaultTxt="Select" />
              </div>
            </div>
            {map(
              column =>
                <div className="columns data-row" key={column.key}>
                  <div className="column is-3">
                    <UIFixedColorPicker defaultValue={column.color} />
                  </div>
                  <div className="column">
                    <div className="control">
                      <UISelectDropdown
                        dropdownList={options}
                        defaultTxt="Column"
                      />
                    </div>
                  </div>
                  <div
                    className="remove-btn"
                    onClick={() => this.removeColumn(column.key)}
                  >
                    <i className="fa fa-trash-o" />
                  </div>
                </div>,
              columns
            )}
            <div className="columns data-row">
              <div className="column is-3" />
              <div className="column">
                <button
                  className="button is-primary is-outlined"
                  onClick={this.addColumn}
                >
                  <ISvg src={IconPlus} />Add Column
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DataPicker1.propTypes = {
  icon: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.array
};

DataPicker1.defaultProps = {
  options: [
    {
      key: 'a',
      name: 'A'
    },
    {
      key: 'b',
      name: 'B'
    }
  ]
};

export default DataPicker1;
