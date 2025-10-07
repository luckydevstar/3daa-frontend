import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import GroupsList from './groups-list';
import { reject, clone, append, propEq, find } from 'ramda';
import QualificationDetails from '../workbooks/workbooks-qualification-details';

const {
  components: { SearchBar, ContentModalNew, EmptyView }
} = common;

const initialState = {
  searchPhrase: '',
  selectedGroups: []
};

class GroupsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = clone(initialState);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.groups) {
      this.initializeSelectedGroups(nextProps.groups);
    }
  }

  initializeSelectedGroups(groups) {
    const selectedGroups = groups.filter(
      ({ qualification_id }) => qualification_id === this.props.qualification_id
    );
    this.setState({ selectedGroups });
  }

  resetState() {
    this.setState(clone(initialState));
  }

  addGroup(group) {
    this.setState({ selectedGroups: append(group, this.state.selectedGroups) });
  }

  removeGroup(id) {
    this.setState({
      selectedGroups: reject(e => e.group_id === id, this.state.selectedGroups)
    });
  }

  isSelected(id) {
    return Boolean(find(propEq('group_id', id), this.state.selectedGroups));
  }

  open() {
    this.resetState();
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  applyFilter(searchPhrase) {
    this.setState({ searchPhrase });
  }

  filterResults(elements) {
    const { searchPhrase } = this.state;
    return elements.filter(element =>
      element.title.toLowerCase().includes(searchPhrase.trim().toLowerCase())
    );
  }

  handleGroupClick(group) {
    const { group_id } = group;
    if (this.isSelected(group_id)) {
      this.removeGroup(group_id);
    } else {
      this.addGroup(group);
    }
  }

  render() {
    const {
      groups,
      onSubmit,
      qualificationName,
      optional,
      mandatory
    } = this.props;
    const { searchPhrase } = this.state;
    const filteredGroups = groups && searchPhrase && this.filterResults(groups);
    return (
      <ContentModalNew
        subtitle="Assign Groups to Pathway"
        description="Select the groups to assign them to this pathway"
        className="list-modal list-modal-groups"
        size="large"
        ref={e => {
          this.modal = e;
        }}
      >
        <QualificationDetails {...{ qualificationName, mandatory, optional }} />
        <SearchBar
          {...searchPhrase}
          onChange={phrase => this.applyFilter(phrase)}
        />
        {searchPhrase && (!filteredGroups || !filteredGroups.length) ? (
          <EmptyView
            title="No results"
            description="There is no results for your query"
          />
        ) : (
          <GroupsList
            groups={filteredGroups || groups}
            handleGroupClick={id => this.handleGroupClick(id)}
            isSelected={id => this.isSelected(id)}
          />
        )}
        <div className="controls">
          <div
            onClick={() => this.close()}
            className="button is-primary is-outlined"
          >
            Cancel
          </div>
          <div
            onClick={() => onSubmit(this.state.selectedGroups)}
            className="button is-primary"
          >
            Assign Groups
          </div>
        </div>
      </ContentModalNew>
    );
  }
}

GroupsModal.defaultProps = {
  groups: null,
  qualification_id: null
};

GroupsModal.propTypes = {
  groups: PropTypes.array,
  qualification_id: PropTypes.number
};

export default GroupsModal;
