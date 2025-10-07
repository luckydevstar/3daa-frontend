import React from 'react';

class SelectPairingListItemItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
    this.selectItem = this.selectItem.bind(this);
  }
  selectItem() {
    this.setState({ isSelected: !this.state.isSelected });
  }
  render() {
    const { item } = this.props;
    const { isSelected } = this.state;
    return (
      <div
        className="pairing-recommended-pairing__list__item__sub pairing-recommended-pairing__list__item__sub--active"
        onClick={this.selectItem}
      >
        <div className="pairing-recommended-pairing__list__item__sub__title">
          <i className="fa fa-circle" aria-hidden="true" />
          <span>{item.item_title}</span>
        </div>
        {isSelected && (
          <i
            className="fa fa-check-circle-o pairing-recommended-pairing__list__item__sub__check"
            aria-hidden="true"
          />
        )}
        {!isSelected && (
          <i
            className="fa fa-circle-o pairing-recommended-pairing__list__item__sub__check"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
}

export default SelectPairingListItemItem;
