import React from 'react';
import classNames from 'classnames';

import SelectPairingListItemItem from './select-pairing-item-item';

class SelectPairingListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeight: '60px',
      open: false
    };

    this.setItemState = this.setItemState.bind(this);
    this.item = null;
  }
  setItemState() {
    if (!this.item) return;
    const { open } = this.state;
    if (open) {
      const maxHeight = this.item.scrollHeight;
      this.setState(
        {
          currentHeight: `${maxHeight}px`
        },
        () => {
          setTimeout(() => {
            this.setState({
              currentHeight: '60px',
              open: false
            });
          }, 0);
        }
      );
    } else {
      const maxHeight = this.item.scrollHeight;
      this.setState(
        {
          currentHeight: `${maxHeight}px`,
          open: true
        },
        () => {
          setTimeout(() => {
            this.setState({
              currentHeight: 'auto'
            });
          }, 400);
        }
      );
    }
  }
  render() {
    const { items, title } = this.props;
    const { currentHeight, open } = this.state;
    return (
      <div
        ref={node => {
          this.item = node;
        }}
        className="pairing-recommended-pairing__list__item"
        style={{ height: currentHeight }}
      >
        <div
          className="pairing-recommended-pairing__list__item__head"
          onClick={this.setItemState}
        >
          <div className="pairing-recommended-pairing__list__item__head__title">
            {title}
          </div>
          <i
            className={classNames(
              'fa',
              'fa-chevron-down',
              'pairing-recommended-pairing__list__item__head__title__arrow',
              {
                'pairing-recommended-pairing__list__item__head__title__arrow--active': open
              }
            )}
            aria-hidden="true"
          />
          <i
            className="fa fa-check-circle-o pairing-recommended-pairing__list__item__head__title__check"
            aria-hidden="true"
          />
        </div>
        {items.map((item, i) => (
          <SelectPairingListItemItem key={i} {...{ item }} />
        ))}
      </div>
    );
  }
}

export default SelectPairingListItem;
