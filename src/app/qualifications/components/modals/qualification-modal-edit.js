import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import { connect } from 'react-redux';

import { Creators as QualificationActions } from 'app/qualifications/actions';

class QualificationModalEdit extends Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.qualificationTypes) {
      this.props.getQualificationTypes();
    }
  }

  render() {
    const { closeModal } = this.props;
    return (
      <div className="qualifications p-20">
        <div className="has-text-centered p-10">
          <h3 className="title is-4">Add or edit a qualification</h3>
        </div>
        <div className="has-text-centered m-b-25">
          <h6>
            Select which type of qualification you want to create or edit.
          </h6>
        </div>
        <div>
          <div className="m-b-10 has-text-centered">
            <a
              className="button is-rounded unregulated-button"
              onClick={() => closeModal(1)}
            >
              Find an unregulated product
              <span className="icon" style={{ marginLeft: 'auto' }}>
                <i className="fa fa-angle-right" />
              </span>
            </a>
          </div>
          <div className="m-b-10 has-text-centered">
            <a
              className="regulated-button button is-rounded"
              onClick={() => closeModal(2)}
            >
              Find a regulated qualification
              <span className="icon" style={{ marginLeft: 'auto' }}>
                <i className="fa fa-angle-right" />
              </span>
            </a>
          </div>
          <div className="m-b-10 has-text-centered">
            <a
              className="button is-rounded standard-button"
              onClick={() => closeModal(3)}
            >
              Find a new standard
              <span className="icon" style={{ marginLeft: 'auto' }}>
                <i className="fa fa-angle-right" />
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  qualificationTypes: state.qualifications.qualificationTypes
});

const mapDispatchToProps = dispatch => ({
  getQualificationTypes: () =>
    dispatch(QualificationActions.getQualificationTypesAttempt())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationModalEdit);
