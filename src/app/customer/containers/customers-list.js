import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from '../actions';
import common from 'app/common';

import { CustomersListHead } from '../components';

const { UILoading, UINavigation, ContentModalConfirm } = common.components;
const { createCloudinaryUrl } = common.util.helpers;

class CustomersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerToDelete: null
    };
    this.goToListAdd = this.goToListAdd.bind(this);
    this.renderCustomers = this.renderCustomers.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.confirmModal = null;
  }
  componentDidMount() {
    const { getCustomersAttempt } = this.props;
    getCustomersAttempt();
  }
  goToListAdd() {
    const { router } = this.props;
    router.push('/customer/add');
  }
  getStyles(logo_media_id) {
    return {
      backgroundImage: `url(${createCloudinaryUrl(logo_media_id, 'image', {
        crop: 'fill'
      })})`
    };
  }
  openConfirm(customerToDelete) {
    this.setState(
      {
        customerToDelete
      },
      this.confirmModal.open
    );
  }
  deleteCustomer() {
    const { customers, deleteCustomerAttempt } = this.props;
    const { customerToDelete } = this.state;
    deleteCustomerAttempt(customers, customerToDelete);
  }
  goToEdit(customer) {
    const { router, setupCustomerEditAttempt } = this.props;
    if (customer) {
      setupCustomerEditAttempt(customer);
      router.push('/customer/add');
    }
  }
  renderCustomers() {
    const { customers } = this.props;
    if (customers.length <= 0)
      return <div className="customers-empty">There are no customers yet</div>;
    return customers.map(customer => (
      <div
        key={customer.platform_customer_id}
        className="grid-item p-5"
        style={this.getStyles(customer.logo_media_id)}
      >
        <div className="title">{`${customer.firstname} ${
          customer.lastname
        }`}</div>
        <div className="customtitle">
          <div className="is-flex">
            <button
              className="button is-outlined is-primary m-r-15"
              onClick={() => {
                this.goToEdit(customer);
              }}
            >
              Edit
            </button>

            <button
              className="button is-outlined is-danger"
              onClick={() => {
                this.openConfirm(customer.platform_customer_id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ));
  }
  render() {
    const { uiLoadingCustomer } = this.props;
    return (
      <div className="workbook-selector-selection-container min-content-height">
        <CustomersListHead
          title="Customers"
          subTitle="Select customer"
          goTo={this.goToListAdd}
        />

        {/* Navigation */}
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              tabs={[]}
              onSearch={() => {}}
              searchPlaceholder="Search all sectors"
            />
          </div>
        </section>
        <div className="grid container">
          {uiLoadingCustomer && <UILoading marginTop="100px" />}
          {!uiLoadingCustomer && this.renderCustomers()}
        </div>
        <ContentModalConfirm
          callback={this.deleteCustomer}
          ref={e => {
            this.confirmModal = e;
          }}
        >
          <h3>Are you sure you want to delete the customer?</h3>
        </ContentModalConfirm>
      </div>
    );
  }
}

const {
  getCustomersAttempt,
  deleteCustomerAttempt,
  setupCustomerEditAttempt
} = Creators;

const mapStateToProps = ({ customer }) => ({
  ...customer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCustomersAttempt,
      deleteCustomerAttempt,
      setupCustomerEditAttempt
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomersList);
