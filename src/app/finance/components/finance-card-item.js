import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import common from 'app/common';

import FrontView from './finance-card-item-front';
import BackView from './finance-card-item-back';

const { UIFlipper } = common.components;

class FinanceCardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      flipped: false
    };
  }

  render() {
    const {
      itemData,

      openChat,
      onActive,
      activating,
      suspending
    } = this.props;

    const { touched, flipped } = this.state;

    return (
      <div className="finance-card-item">
        <div
          className={classNames('hover-capture', { touched, flipped })}
          onClick={() => this.setState({ touched: !touched })}
        >
          <UIFlipper
            front={
              <FrontView
                {...{
                  itemData,

                  openChat,
                  onActive,
                  activating,
                  suspending
                }}
              />
            }
            back={
              <BackView
                {...{
                  itemData
                }}
              />
            }
          />
        </div>
      </div>
    );
  }
}

export default connect()(FinanceCardItem);
