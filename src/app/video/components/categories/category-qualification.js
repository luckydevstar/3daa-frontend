import React, { Component } from 'react';
import cx from 'classnames';
import common from 'app/common';
import { filter, concat, findIndex, propEq } from 'ramda';

const { UISearch, UICheckbox } = common.components;

class CategoryQualification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    };

    this.onSearch = this.onSearch.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.selectQualification = this.selectQualification.bind(this);
  }

  onSearch(searchTerm) {
    this.setState({
      searchTerm
    });
  }

  isSelected(qualification_id) {
    const { selectedQualifications } = this.props;
    if (
      findIndex(propEq('qualification_id', qualification_id))(
        selectedQualifications
      ) > -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  selectQualification(qualification) {
    const { selectedQualifications, setVideoQualifications } = this.props;
    let changedQualifications = [];

    if (this.isSelected(qualification.qualification_id)) {
      changedQualifications = selectedQualifications.filter(
        qual => qual.qualification_id !== qualification.qualification_id
      );
    } else {
      changedQualifications = concat(selectedQualifications, [qualification]);
    }

    setVideoQualifications(changedQualifications);
  }

  render() {
    const { allQualifications, selectedQualifications } = this.props;
    const { searchTerm } = this.state;

    let filteredQualifications = [];

    if (searchTerm) {
      filteredQualifications = filter(qualification => {
        if (
          qualification.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          qualification.reference
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          return true;
        } else {
          if (
            qualification.units.findIndex(unit => {
              return (
                unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                unit.reference.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }) > -1
          ) {
            return true;
          }
        }
        return false;
      })(allQualifications);
    } else {
      filteredQualifications = selectedQualifications;
    }

    return (
      <div className="search-qualification">
        <label className="label" htmlFor="search">
          Search for a Qualification or Unit
        </label>
        <UISearch
          onSearch={e => this.onSearch(e)}
          placeholder="Search by LARA Reference or Title"
          translate={true}
        />
        <div className="result">
          {filteredQualifications &&
            filteredQualifications.map(qualification => (
              <div
                className="qualification-card"
                key={`video-qual-card-${qualification.qualification_id}`}
              >
                <div className="columns is-marginless">
                  <div className="column is-10 q-lara p-t-5">
                    {qualification.reference}
                  </div>
                  <div className="column is-2 has-text-right p-t-5">
                    <a href="#">view</a>
                  </div>
                </div>
                <div className="columns is-marginless">
                  <div className="column is-10 p-t-0 p-b-5">
                    <p className="q-title has-text-left">
                      {qualification.title}
                    </p>
                    <p className="q-level has-text-left">{`Level ${
                      qualification.level
                    }`}</p>
                  </div>
                  <div className="column is-2 p-t-0 has-text-right p-b-5">
                    <UICheckbox
                      checked={this.isSelected(qualification.qualification_id)}
                      onChange={() => this.selectQualification(qualification)}
                    />
                  </div>
                </div>
              </div>
            ))}
          {(!filteredQualifications || filteredQualifications.length <= 0) && (
            <div className="is-centered">No Qualification</div>
          )}
        </div>
      </div>
    );
  }
}

export default CategoryQualification;
