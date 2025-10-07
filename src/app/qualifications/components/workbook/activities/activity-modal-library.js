import React from 'react';
import classNames from 'classnames';
import Libraries from 'app/libraries';

const ActivityLibrary = Libraries.containers.ActivityLibrary;

class ActvivityModalLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: {},
      searchTerm: '',
      pushedSearchTerm: ''
    };
    this.search = this.search.bind(this);
  }

  search(e) {
    e.preventDefault();
    const { searchTerm } = this.state;
    this.setState({
      pushedSearchTerm: searchTerm
    });
  }

  render() {
    const {
      attemptingCreateActivity,
      attemptingUpdateActivity,
      closeModal,
      setActivity,
      passedActivity
    } = this.props;

    const { pushedSearchTerm, selectedActivity } = this.state;

    const { search } = this;

    const buttonClassNames = classNames('button', 'is-success', {
      'is-loading': attemptingCreateActivity || attemptingUpdateActivity
    });

    const buttonDisabled = !Object.keys(selectedActivity).length;

    const libraryProps = {
      searchTerm: pushedSearchTerm,
      passedActivity,
      onActivitySelect: activity =>
        this.setState({ selectedActivity: activity })
    };

    return (
      <div className="library-section-container">
        <div className="tabs-search">
          <form onSubmit={search}>
            <p className="control search">
              <input
                className="input"
                type="text"
                placeholder="Search all activities"
                onChange={e => this.setState({ searchTerm: e.target.value })}
              />
            </p>
          </form>
        </div>
        <ActivityLibrary {...libraryProps} />
        <div className="nav">
          <div className="field is-grouped nav-center">
            <div className="button is-active m-r-20" onClick={closeModal}>
              Cancel
            </div>
            <button
              disabled={buttonDisabled}
              onClick={() => setActivity(selectedActivity)}
              className={buttonClassNames}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ActvivityModalLibrary;
