import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import IconCardView from 'images/icon_card_view.svg';
import IconListView from 'images/icon_list_view.svg';

import { Option, Text, Label } from 'app/intl';

class SwitchLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { activeLayout, handleLayoutChange } = this.props;

    return (
      <section className="container explorer-nav">
        <div className="position-container container">
          <div className="view-menu">
            <div
              className={classNames('view-option', 'view-option-card', {
                active: activeLayout === 'card'
              })}
              onClick={() => handleLayoutChange('card')}
            >
              <Text iKey="card_view" />
              <Isvg src={IconCardView} />
            </div>
            <div
              className={classNames('view-option', 'view-option-list', {
                active: activeLayout === 'list'
              })}
              onClick={() => handleLayoutChange('list')}
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

SwitchLayout.propTypes = {
  activeLayout: PropTypes.string,
  handleLayoutChange: PropTypes.func
};

SwitchLayout.defaultProps = {
  activeLayout: 'card',
  handleLayoutChange: () => {}
};

export default SwitchLayout;
