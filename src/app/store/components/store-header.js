import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as lodash from 'lodash';

import BasketButton from './basket-button';
import { getCartDetails, getTotalAmount } from '../utils';

import UploadUsersFileModal from './modals/upload-users-file-modal';

class StoreHeader extends Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    browserHistory.goBack();
  }

  openUploadUsersFileModal() {
    this.uploadUsersFileModal.modal.open();
    // console.log(this.uploadUsersFileModal.modal.open());
  }

  render() {
    const {
      cart,
      total,
      title,
      subtitle,
      showBackButton,
      showCheckoutButton,
      showUploadFileButton,
      showBasketButton,
      showAccountBalance,
      backLink,

      balance
    } = this.props;

    return (
      <section className="content-section hero smaller gray">
        <div className="hero-body">
          <div className="container">
            <UploadUsersFileModal
              ref={e => {
                this.uploadUsersFileModal = e;
              }}
            />
            <div className="store-header columns">
              {showBackButton && (
                <button
                  className="back button is-primary is-outlined column m-r-30 flex-none"
                  onClick={this.goBack}
                >
                  <i className="fa fa-angle-left" />
                </button>
              )}
              <div className="column flex-none">
                <div className="title">{title}</div>
                <div className="subtitle">{subtitle}</div>
              </div>
              <div className="right column has-text-right">
                {showCheckoutButton && (
                  <Link className="button is-primary m-r-20" to="/store/basket">
                    Checkout
                  </Link>
                )}
                {showUploadFileButton && (
                  <a
                    className="button is-primary is-outlined m-r-20"
                    onClick={() => this.openUploadUsersFileModal()}
                  >
                    Upload A File
                  </a>
                )}
                {showBasketButton && (
                  <BasketButton
                    {...{
                      cart,
                      total
                    }}
                  />
                )}
                {showAccountBalance && (
                  <div className="account-balance">
                    <div>
                      <span>
                        £
                        {(
                          (lodash.get(balance, 'total_revenue') || 0) -
                          (lodash.get(balance, 'outstanding_revenue') || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <span>Account Balance</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

StoreHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showBackButton: PropTypes.bool,
  showCheckoutButton: PropTypes.bool,
  showUploadFileButton: PropTypes.bool,
  showBasketButton: PropTypes.bool,
  showAccountBalance: PropTypes.bool,
  backLink: PropTypes.string
};

StoreHeader.defaultProps = {
  title: '',
  subtitle: '',
  showBackButton: true,
  showCheckoutButton: false,
  showUploadFileButton: true,
  showBasketButton: false,
  showAccountBalance: false,
  backLink: '/store'
};

const mapStateToProps = ({ store, profile }) => ({
  cart: getCartDetails(store),
  total: getTotalAmount(store),
  balance: lodash.get(profile, 'adminBalance')
});

export default connect(
  mapStateToProps,
  null
)(StoreHeader);

// <Link className="button is-primary is-outlined m-r-20">
//   Add New Users
// </Link>
