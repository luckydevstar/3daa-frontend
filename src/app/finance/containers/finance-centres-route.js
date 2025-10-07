import React, { Component } from 'react';
import { connect } from 'react-redux';
import Isvg from 'react-inlinesvg';
import * as lodash from 'lodash';

import common from 'app/common';
import ModalGroup from 'app/modal-group/container';
import { Text } from 'app/intl';

import { Creators as Actions } from '../actions';
import navTabs from '../config/navs';
import {
  HeaderView,
  SwitchLayoutView,
  ListView,
  CardView,
  FinanceModalSuspend
} from '../components';

const {
  components: { Pagination, Footer, ContentModalNew, UINavigation, UILoading },
  util: {
    helpers: { checkRolesAndPermissions }
  }
} = common;

const ROWS = 4;

class FinanceCentresRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '',
      pageNumber: 1,
      itemsPerPage: 15,

      onlineFilter: null
    };

    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onActive = this.onActive.bind(this);
    this.onSuspend = this.onSuspend.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onOrder = this.onOrder.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { centres, financeGetAllCentresAttempt } = this.props;
    if (!lodash.get(centres, 'length')) {
      financeGetAllCentresAttempt(null);
    }
  }

  componentDidMount() {
    const colNum = Math.floor(document.documentElement.clientWidth / 300);
    this.setState({ itemsPerPage: colNum * ROWS });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  // Component helper funcs

  onSearch(term) {
    const { financeSetSearchTerm } = this.props;
    financeSetSearchTerm(term);
  }

  onSelected(item) {
    const { financeSetActiveCentre } = this.props;
    financeSetActiveCentre(item);
  }

  onOrder(field, order) {
    const { financeUpdateOrderSettings } = this.props;
    financeUpdateOrderSettings(field, order);
  }

  onActive(e, item) {
    const { financeSetActiveCentre, financeRestoreCentreAttempt } = this.props;
    const checked = lodash.get(e, 'checked');

    financeSetActiveCentre(item);

    if (checked) {
      financeRestoreCentreAttempt(item.centre_id);
    } else {
      this.suspendModal.open();
    }
  }

  onSuspend() {
    const { activeCentre, financeSuspendCentreAttempt } = this.props;
    this.suspendModal.close();

    if (activeCentre) financeSuspendCentreAttempt(activeCentre.centre_id);
  }

  // Change card/list/featured view
  handleLayoutChange(view) {
    const { financeSetActiveLayout } = this.props;
    financeSetActiveLayout(view);
  }

  goToPage(pageNumber, setStateCallback = () => {}) {
    this.setState({ pageNumber }, setStateCallback());
  }

  render() {
    // Props
    const {
      user,
      centres,
      activeCentre,
      activeLayout,
      searchTerm,
      sortingSetting,

      attemptingFinanceGetAllCentres,
      attemptingFinanceSuspendCentre,
      attemptingFinanceRestoreCentre
    } = this.props;

    const { handleLayoutChange } = this;

    // State
    const { activeTab, pageNumber, itemsPerPage } = this.state;

    let filteredItems = centres;

    if (searchTerm) {
      const tempPhrase = searchTerm.trim().toLowerCase();

      filteredItems = lodash.filter(filteredItems, i => {
        if (!i.centre_name) return false;
        if (('' + i.centre_name).toLowerCase().includes(tempPhrase))
          return true;
        return false;
      });
    }

    if (activeLayout == 'list') {
      const sortHeadingList = Object.keys(sortingSetting);
      const keys = [];
      const orders = [];
      sortHeadingList.forEach(i => {
        if (sortingSetting[i].sortable && sortingSetting[i].order) {
          keys.push(sortingSetting[i].name);
          orders.push(sortingSetting[i].order);
        }
      });
      filteredItems = lodash.orderBy(filteredItems, keys, orders);
    }

    const centreNum = lodash.size(filteredItems) || 0;
    filteredItems = lodash.slice(
      filteredItems,
      itemsPerPage * (pageNumber - 1),
      itemsPerPage * pageNumber
    );

    return (
      <div>
        <HeaderView />
        {/* Navigation */}
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active={activeTab}
              change={e => {}}
              tabs={navTabs}
              onSearch={value => this.onSearch(value)}
            />
          </div>
        </section>
        <SwitchLayoutView
          {...{
            handleLayoutChange,
            activeLayout
          }}
        />
        <div className="finance-container">
          {attemptingFinanceGetAllCentres ? (
            <UILoading marginTop="100px" />
          ) : activeLayout == 'card' ? (
            <CardView
              items={filteredItems}
              activeItem={activeCentre}
              openChat={() => {}}
              onActive={this.onActive}
              activating={attemptingFinanceRestoreCentre}
              suspending={attemptingFinanceSuspendCentre}
            />
          ) : (
            <ListView
              sortSettings={sortingSetting}
              items={filteredItems}
              activeItem={activeCentre}
              onSelected={this.onSelected}
              onOrder={this.onOrder}
              openChat={() => {}}
              onActive={this.onActive}
              activating={attemptingFinanceRestoreCentre}
              suspending={attemptingFinanceSuspendCentre}
            />
          )}

          <Pagination
            itemsLength={parseInt(centreNum)}
            itemsPerPage={itemsPerPage}
            maxPagesDisplayed={3}
            initialPage={pageNumber - 1}
            onPageChange={this.goToPage}
            forcePage={pageNumber - 1}
          />
        </div>
        <Footer />

        <ContentModalNew
          ref={e => {
            this.suspendModal = e;
          }}
        >
          <FinanceModalSuspend
            title="Suspend Account"
            content="You're about to suspend their account"
            onSuspend={this.onSuspend}
          />
        </ContentModalNew>
      </div>
    );
  }
}

const mapStateToProps = ({ profile: { user }, finance }) => ({
  user,
  centres: lodash.get(finance, 'centres') || [],
  activeCentre: lodash.get(finance, 'activeCentre'),
  activeLayout: lodash.get(finance, 'activeLayout') || 'card',
  sortingSetting: lodash.get(finance, 'sorting.config') || {},
  searchTerm: lodash.get(finance, 'searchTerm') || '',

  attemptingFinanceGetAllCentres: finance.attemptingFinanceGetAllCentres,
  attemptingFinanceSuspendCentre: finance.attemptingFinanceSuspendCentre,
  attemptingFinanceRestoreCentre: finance.attemptingFinanceRestoreCentre
});

const mapDispatchToProps = dispatch => ({
  financeSetActiveLayout: layout =>
    dispatch(Actions.financeSetActiveLayout(layout)),
  financeSetActiveCentre: centre =>
    dispatch(Actions.financeSetActiveCentre(centre)),
  financeSetSearchTerm: term => dispatch(Actions.financeSetSearchTerm(term)),
  financeUpdateOrderSettings: (orderProp, order) =>
    dispatch(Actions.financeUpdateOrderSettings(orderProp, order)),

  financeGetAllCentresAttempt: params =>
    dispatch(Actions.financeGetAllCentresAttempt(params)),

  financeRestoreCentreAttempt: centre_id =>
    dispatch(Actions.financeRestoreCentreAttempt(centre_id)),
  financeSuspendCentreAttempt: centre_id =>
    dispatch(Actions.financeSuspendCentreAttempt(centre_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceCentresRoute);
