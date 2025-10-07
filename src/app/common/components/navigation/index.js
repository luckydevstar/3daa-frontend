import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { is } from 'ramda';
import cx from 'classnames';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { active: null };
  }

  componentDidMount() {
    if (
      this.props.default !== undefined &&
      this.props.activeTab === undefined
    ) {
      this.setState({ active: parseInt(this.props.default) });
    } else {
      this.setState({ active: parseInt(this.props.activeTab) });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.activeTab !== undefined) {
      this.setState({
        active: nextProps.activeTab
      });
    }
  }

  handleClick(id) {
    this.setState({ active: parseInt(id) }, () => {
      if (this.props.callback) {
        this.props.callback(id);
      }
    });
  }

  render() {
    const { tabs = [], className } = this.props;
    return (
      <section className={cx(className, 'content-section')}>
        <div className="container">
          <div className="tabs">
            <ul>
              {tabs.map((tab, key) => {
                return (
                  <li
                    key={key}
                    className={this.state.active === key ? 'is-active' : ''}
                  >
                    {is(String, tab) ? (
                      <a onClick={() => this.handleClick(key)}>{tab}</a>
                    ) : (
                      tab
                    )}
                  </li>
                );
              })}
            </ul>
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }
}

Navigation.propTypes = {
  tabs: PropTypes.array.isRequired
};

export default Navigation;
