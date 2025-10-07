// CORE
import React from 'react';
import { and } from 'ramda';
// COMPONENTS
import AddUnit from '../components/unit-add';
import UnitElement from './unit-element';
import common from 'app/common';

// ADDONS
const {
  ContentModal,
  ContentModalConfirm,
  UILoading,
  Pagination,
  UINavigation
} = common.components;

class UnitList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unit_id: null
    };

    this.handleConfirm = this.handleConfirm.bind(this);
    this.hideAddUnitModal = this.hideAddUnitModal.bind(this);
    this.confirmDeleteUnit = this.confirmDeleteUnit.bind(this);
  }

  // Modal Handling
  showAddUnitModal() {
    this.addUnitModal.open();
  }

  hideAddUnitModal(e) {
    if (e) {
      e.preventDefault();
    }
    this.addUnitModal.close();
  }

  handleConfirm(values, someFunc, form) {
    this.addUnitModal.close();
    // TODO needs better sollution.
    // Modal component gets unmounted before modal closes. need to fix that
    setTimeout(() => this.props.addUnitAttempt(values, someFunc, form), 100);
  }

  confirmDeleteUnit(unit_id) {
    this.setState({ unit_id }, () => {
      this.confirmDeleteUnitModal.open();
    });
  }

  render() {
    return (
      <div>
        <section className="content-section hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Unit Management</h1>
              <h2 className="subtitle">Add and manage units</h2>
              <div className="hero-nav">
                <button
                  onClick={() => {
                    this.showAddUnitModal();
                  }}
                  className="button is-primary is-outlined"
                >
                  Add New Unit
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="content-section separated"> */}
        {/* <Navigation
          tabs={['Units']}
          className="unit-menu separated"
          activeTab={0}
        >
          <ul className="is-right">
            <p className="control search">
              <input
                className="input"
                type="text"
                placeholder="Search all units"
                onKeyUp={e => {
                  this.props.filterUnits(e);
                }}
              />
            </p>
          </ul>
        </Navigation> */}
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active="units"
              tabs={[{ key: 'units', text: 'Units', url: '/units' }]}
              onSearch={value => {
                this.props.filterUnits(value);
              }}
              searchPlaceholder="Search all units"
            />
          </div>
        </section>

        <section className="content-section m-t-20">
          <div className="container">
            {this.props.attemptingGet && (
              <UILoading minHeight="200px" alignMiddle />
            )}
            {and(this.props.unit.length > 0, !this.props.attemptingGet) && (
              <div className="columns is-multiline">
                {this.props.unit.map(object => {
                  console.log(object);
                  return (
                    <UnitElement
                      reference={object.reference}
                      title={object.title}
                      status={object.status}
                      unit_id={object.unit_id}
                      confirmDeleteUnit={this.confirmDeleteUnit}
                      key={object.unit_id}
                      level={object.level}
                      credits={object.credit_value}
                      guided_learning_hours={object.guided_learning_hours}
                    />
                  );
                })}
              </div>
            )}
            {and(this.props.unit.length <= 0, !this.props.attemptingGet) && (
              <div className="has-text-centered p-b-10">There is no Unit.</div>
            )}
          </div>
        </section>
        <Pagination
          itemsLength={this.props.unitsLength}
          itemsPerPage={20}
          forcePage={this.props.currentPage - 1 || 0}
          maxPagesDisplayed={4}
          onPageChange={activePage => {
            this.props.onPageChange(activePage);
          }}
        />
        <ContentModal
          ref={e => {
            this.addUnitModal = e;
          }}
        >
          <AddUnit
            handleConfirm={this.handleConfirm}
            closePanel={e => this.hideAddUnitModal(e)}
          />
        </ContentModal>
        <ContentModalConfirm
          callback={() => this.props.deleteUnit(this.state.unit_id)}
          ref={e => {
            this.confirmDeleteUnitModal = e;
          }}
        >
          <p>Are you sure to delete this unit!?</p>
        </ContentModalConfirm>
      </div>
    );
  }
}

export default UnitList;
