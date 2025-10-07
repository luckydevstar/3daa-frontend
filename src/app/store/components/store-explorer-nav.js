import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import cx from 'classnames';
import Isvg from 'react-inlinesvg';

import IconCardView from 'images/icon_card_view.svg';
import IconListView from 'images/icon_list_view.svg';

import { Text, Label } from 'app/intl';

class StoreExplorerNav extends Component {
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
    const { hidden, preContent } = this.props;

    return (
      <section
        className={`container explorer-nav ${hidden ? 'hidden' : ''}`}
        ref={e => {
          this.nav = e;
        }}
      >
        <div className="position-container container">
          {preContent}
          <div className="view-menu">
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
          </div>
        </div>
      </section>
    );
  }
}

StoreExplorerNav.propTypes = {
  hidden: PropTypes.bool,
  setView: PropTypes.func
};

StoreExplorerNav.defaultProps = {
  preContent: null,
  hidden: false,
  setView: () => {}
};

export default StoreExplorerNav;
