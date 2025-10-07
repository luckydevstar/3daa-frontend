import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import cx from 'classnames';
import Isvg from 'react-inlinesvg';

import IconCardView from 'images/icon_card_view.svg';
import IconListView from 'images/icon_list_view.svg';

import { Text, Label } from 'app/intl';

class WorkbooksExplorerNav extends Component {
  constructor(props) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.state = {
      activeView: 'list'
    };
  }

  handleViewChange(viewName) {
    this.props.setView(viewName);
    this.setState({
      activeView: viewName
    });
  }

  render() {
    const { activeView } = this.state;
    const {
      showSelected,
      onSelectedChange,
      hidden,
      handleCohortClick,
      attemptingMapQualification
    } = this.props;

    return (
      <section
        className={`container explorer-nav ${hidden ? 'hidden' : ''}`}
        ref={e => {
          this.nav = e;
        }}
      >
        <div className="position-container container">
          <div className="view-menu">
            {onSelectedChange && (
              <div
                className={
                  showSelected
                    ? 'view-option view-toggle active'
                    : 'view-option view-toggle'
                }
              >
                <div>
                  <Label iKey="show_selected" htmlFor="showSelected" />:
                  <Toggle
                    id="showSelected"
                    defaultChecked={showSelected}
                    icons={false}
                    onChange={onSelectedChange}
                  />
                </div>
              </div>
            )}
            <div
              className={
                activeView === 'card'
                  ? 'view-option view-option-card active'
                  : 'view-option view-option-card'
              }
              onClick={() => this.handleViewChange('card')}
            >
              <Text iKey="card_view" />
              <Isvg src={IconCardView} />
            </div>
            <div
              className={
                activeView === 'list'
                  ? 'view-option view-option-list active'
                  : 'view-option view-option-list'
              }
              onClick={() => this.handleViewChange('list')}
            >
              <Text iKey="list_view" />
              <Isvg src={IconListView} />
            </div>
            {handleCohortClick && (
              <div className="cohort-button-container">
                <div
                  className={cx(
                    'button',
                    'is-primary',
                    'is-outlined',
                    'cohort',
                    {
                      'is-loading': attemptingMapQualification
                    }
                  )}
                  onClick={() => handleCohortClick()}
                >
                  <Text iKey="add_to_cohort" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

WorkbooksExplorerNav.propTypes = {
  showSelected: PropTypes.bool,
  onSelectedChange: PropTypes.func,
  setView: PropTypes.func,
  attemptingMapQualification: PropTypes.bool,
  handleCohortClick: PropTypes.func
};

WorkbooksExplorerNav.defaultProps = {
  showSelected: false,
  onSelectedChange: null,
  setView: () => console.warn('Explorer nav set view prop not set'),
  attemptingMapQualification: false,
  handleCohortClick: null
};

export default WorkbooksExplorerNav;
