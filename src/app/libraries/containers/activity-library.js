import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Actions from '../actions/creator';
import common from 'app/common';

const { Pagination, UILoading } = common.components;
const helpers = common.util.helpers;

class ActivityLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: {},
      params: {
        type: null,
        currentPage: 1,
        search: '',
        limit: 10
      }
    };

    this.getActivities = this.getActivities.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setType = this.setType.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.activityExistsInDom = this.activityExistsInDom.bind(this);
    this.elementContent = this.elementContent.bind(this);
    this.elementTypes = this.elementTypes.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { activities, passedActivity, searchTerm } = this.props;
    const { getActivities } = this;
    getActivities();
    if (passedActivity) {
      this.setState({
        selectedActivity: passedActivity
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { errorCode, searchTerm } = this.props;
    const { getActivities } = this;
    const { params } = this.state;

    if (nextProps.errorCode) {
      this.setState({
        errorCode: nextProps.errorCode
      });
    } else {
      this.setState({
        errorCode: null
      });
    }

    /**
     * Search term is defined as a prop.
     * This is the logic that updates the result based on it.
     */
    if (searchTerm !== nextProps.searchTerm) {
      this.setState(
        {
          params: {
            ...params,
            currentPage: 1,
            search: nextProps.searchTerm
          }
        },
        getActivities
      );
    }
  }

  /**
   * Get params and pass to getActivities()
   */
  getActivities() {
    const { params } = this.state;
    const { getActivitiesAttempt, total } = this.props;

    let newParams = { ...params };
    newParams.offset = (params.currentPage - 1) * params.limit;
    delete newParams.currentPage;

    getActivitiesAttempt(newParams);
  }

  /**
   * Go to a specific page.
   * @param  {Number} pageNo Page number
   */
  setPage(page) {
    const { getActivities } = this;
    const { params } = this.state;
    this.setState(
      {
        params: {
          ...params,
          currentPage: page
        }
      },
      getActivities
    );
  }

  /**
   * Set the filtered activity type
   * @param {Number} type Activity type ID
   */
  setType(e) {
    const { getActivities } = this;
    const { params } = this.state;
    const type = parseInt(e.target.value);
    this.setState(
      {
        params: {
          ...params,
          type
        }
      },
      getActivities
    );
  }

  /**
   * Internally set activity index and call onActivitySelect callback
   * if it exists.
   * @param  {Number} i Index of activity in current activities set to select.
   */
  selectActivity(i) {
    const { activities, onActivitySelect } = this.props;
    this.setState({
      selectedActivity: activities[i]
    });
    onActivitySelect && onActivitySelect(activities[i]);
  }

  //HACK :(
  activityExistsInDom(id) {
    return document.querySelector(`.activity-block-${id}`) ? true : false;
  }

  elementContent() {
    const {
      errorCode,
      activities,
      searchTerm,
      loading,
      passedActivity
    } = this.props;
    const { selectedActivity } = this.state;
    const { selectActivity, activityExistsInDom } = this;

    if (!errorCode) {
      if (!activities.length && !loading && searchTerm.length) {
        return (
          <div
            style={{ width: '100%', fontStyle: 'italic' }}
            className="p-20 has-text-centered"
          >
            Sorry, no activities found.
          </div>
        );
      } else {
        return activities.map((el, i) => {
          const current = el.activity_id === passedActivity.activity_id;
          const checked = el.activity_id === selectedActivity.activity_id;
          const disabled = !current && activityExistsInDom(el.activity_id);
          const classes = classNames('is-6 column', {
            disabled: disabled
          });
          let image;
          if (el.tout.length) {
            image = helpers.createCloudinaryUrl(el.tout, 'image');
          }
          return (
            <div
              onClick={() => !disabled && selectActivity(i)}
              key={i}
              className={classes}
            >
              <div className="library-item media">
                <div className="media-left selector">
                  <label className="custom radio">
                    <input type="radio" checked={checked} />
                    <span className="ui" />
                  </label>
                </div>
                {image ? (
                  <div
                    className="media-left image has-image"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ) : (
                  <div className="media-left image">
                    <span className="fa fa-trophy" />
                  </div>
                )}
                <div className="media-content">
                  <div className="title">{`${el.title} ${el.activity_code &&
                    `(${el.activity_code})`}`}</div>
                  <div className="description">{el.description}</div>
                </div>
              </div>
            </div>
          );
        });
      }
    } else if (errorCode) {
      return (
        <div className="is-text-danger p-20 has-text-center">{errorCode}</div>
      );
    }
  }

  elementTypes() {
    const { total, types } = this.props;
    const { setType } = this;
    return total && types ? (
      <div className="filter">
        <div className="select" onChange={setType}>
          <select>
            <option value={null}>All activity types</option>
            {types.map((type, i) => (
              <option key={i} value={type.activity_type_id}>
                {type.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    ) : null;
  }

  render() {
    const { loading, total } = this.props;
    const { elementContent, elementTypes } = this;
    const { currentPage } = this.state.params;
    return (
      <div className="library-container" style={{ position: 'relative' }}>
        {loading ? <UILoading isLoadingOverlay /> : null}
        <div className="library-header">{elementTypes()}</div>
        <div className="library-body">
          <div className="columns">{elementContent()}</div>
        </div>
        <div className="library-pagination">
          {total ? (
            <Pagination
              forcePage={currentPage - 1}
              itemsLength={total}
              itemsPerPage={10}
              maxPagesDisplayed={3}
              onPageChange={pageNo => this.setPage(pageNo)}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    types: state.qualifications.activityTypes,
    activities: state.libraries.activities,
    total: state.libraries.totalActivities,
    loading: state.libraries.attemptingGetActivities,
    errorCode: state.libraries.errorCode
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getActivitiesAttempt: params => {
      dispatch(Actions.getActivitiesAttempt(params));
    }
  };
};

ActivityLibrary.propTypes = {
  searchTerm: PropTypes.string
};
ActivityLibrary.propDefaults = {
  searchTerm: ''
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityLibrary);
