import React from 'react';
import { connect } from 'react-redux';

const ProfileReferences = ({ isLoggedInUser }) => {
  return (
    <div className="column content-middle">
      <h2>references tab</h2>
    </div>
  );
};

const mapStateToProps = ({ profileBio }) => ({
  ...profileBio
});

// const mapDispatchToProps = dispatch => ({

// });

export default connect(mapStateToProps, null)(ProfileReferences);
