import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ISvg from 'react-inlinesvg';
import IconBasket from 'images/icon_basket.svg';

class BasketButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basketVisible: false
    };

    this.openBasketPanel = this.openBasketPanel.bind(this);
    this.closeBasketPanel = this.closeBasketPanel.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    if (this.state.basketVisible) {
      document.removeEventListener('click', this.handleClick, false);
    }
  }

  openBasketPanel() {
    this.setState({
      basketVisible: true
    });
    document.addEventListener('click', this.handleClick, false);
  }

  closeBasketPanel() {
    this.setState({
      basketVisible: false
    });
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick(e) {
    if (!this.el || this.el.contains(e.target)) {
      return;
    }
    this.closeBasketPanel();
  }

  render() {
    const { basketVisible } = this.state;
    const { cart, total } = this.props;

    return (
      <div className="basket-button">
        <button
          className="button is-primary is-outlined"
          onClick={this.openBasketPanel}
        >
          <span className="m-r-10">My Basket</span>
          <ISvg src={IconBasket} />
          <span className="m-l-5">{cart.length}</span>
        </button>
        {basketVisible && (
          <div
            className="basket-panel"
            ref={el => {
              this.el = el;
            }}
          >
            <div className="arrow" />
            <div className="panel-content has-text-left">
              <div className="list">
                <div className="item">
                  <div className="my-basket m-b-10">
                    <span className="m-r-20">My Basket</span>
                    <ISvg src={IconBasket} />
                    <span className="m-l-5">{cart.length}</span>
                  </div>
                  {cart.map((item, i) => (
                    <div key={`b-${i}`}>
                      <span className="course-title">{item.title}</span>
                      <span>
                        &nbsp; x &nbsp;{item.count} &nbsp;£{item.price} Each
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="total">
                <span>Total:</span>
                <span className="price">£{total}</span>
              </div>
              <div className="checkout">
                {
                  // <Link className="button is-primary" to="/store/checkout">
                  //   Checkout
                  // </Link>
                }
                <Link className="button is-primary" to="/store/basket">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

BasketButton.propTypes = {
  cart: PropTypes.array,
  total: PropTypes.number
};

BasketButton.defaultProps = {
  cart: [],
  total: 0
};

export default BasketButton;
