import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import LearersList from './learners-list';
import { any, filter, path, pipe } from 'ramda';

const { components: { SearchBar, ContentModalNew, EmptyView } } = common;

class LearnersListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: null
    };
  }

  filterResults(learners) {
    const { searchPhrase } = this.state;
    const fieldsToFilter = [
      ['screen_name'],
      ['current_qualification', 'title'],
      ['current_qualification', 'sector']
    ];
    const compare = element =>
      element &&
      element.toLowerCase().includes(searchPhrase.trim().toLowerCase());
    const learnersFilter = learner =>
      any(searchPath => pipe(path(searchPath), compare)(learner))(
        fieldsToFilter
      );

    return filter(learnersFilter, learners);
  }

  open() {
    this.contentModal.open();
  }

  close() {
    this.contentModal.close();
  }

  applyFilter(searchPhrase) {
    this.setState({ searchPhrase });
  }

  render() {
    const { learners, onClose, onAssessClick } = this.props;
    const { searchPhrase } = this.state;
    const filteredLearners =
      learners && searchPhrase && this.filterResults(learners);
    return (
      <ContentModalNew
        subtitle="Assess Workbooks"
        description="Select a learner to check learner’s progress"
        className="list-modal"
        size="large"
        onClose={onClose}
        ref={e => {
          this.contentModal = e;
        }}
      >
        <SearchBar
          {...searchPhrase}
          onChange={phrase => this.applyFilter(phrase)}
        />
        {searchPhrase && (!filteredLearners || !filteredLearners.length)
          ? <EmptyView
              title="No results"
              description="There is no results for your query"
            />
          : <LearersList
              {...{ onAssessClick }}
              learners={filteredLearners || learners}
            />}
      </ContentModalNew>
    );
  }
}

LearnersListModal.defaultProps = {
  learners: PropTypes.array.isRequired
};

export default LearnersListModal;
