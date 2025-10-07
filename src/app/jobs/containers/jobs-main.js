import React from 'react';
import { connect } from 'react-redux';
import { Creators } from '../actions';
import * as sectorActions from 'app/sectors/actions';
import * as qualificationActions from 'app/qualifications/actions';

class JobsMain extends React.Component {
  componentDidMount() {
    const { getJobs, getAllQualifications } = this.props;
    getAllQualifications();
    getJobs(1301);
  }
  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = dispatch => ({
  getJobs: centre_id => dispatch(Creators.getJobsAttempt(centre_id)),
  getSectors: () => dispatch(sectorActions.Creators.getSectorsAttempt()),
  getAllQualifications: () =>
    dispatch(qualificationActions.Creators.getAllQualificationsAttempt())
});

export default connect(
  null,
  mapDispatchToProps
)(JobsMain);
