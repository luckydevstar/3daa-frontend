import React from 'react';
import common from 'app/common';
import Toggle from 'react-toggle';

import { FieldArray } from 'redux-form';
import { Roles } from 'app/core/config/constants';
import { isEmpty, find, propEq, findIndex, path } from 'ramda';

const { CentreLearner } = Roles;
const {
  components: { SearchBar, ProgressBadge }
} = common;

const userSelected = (user, selectedUsers) =>
  find(propEq('member_id', user.member_id))(selectedUsers);
const selectedUserIndex = (user, selectedUsers) =>
  findIndex(propEq('member_id', user.member_id))(selectedUsers);

const GroupLearners = ({
  getSearchResults,
  searchTerm,
  searchResults,
  uiSearching,
  uiShowSelected,
  setShowSelected
}) => (
  <div className="group-tutors-container user-selection">
    <div className="columns">
      <div className="column is-three-quarters">
        <SearchBar
          searchPhrase={searchTerm}
          onChange={val => getSearchResults(val, CentreLearner)}
          searching={uiSearching}
          placeholder="Find learners"
        />
      </div>
      <div className="column toggle-container">
        <span className="m-r-15">Show selected</span>
        <Toggle
          defaultChecked={uiShowSelected}
          icons={false}
          onChange={() => setShowSelected(!uiShowSelected)}
        />
      </div>
    </div>
    <FieldArray
      name="learners"
      component={({ fields }) => (
        <div
          className={`group-members-selection-container ${
            uiShowSelected ? 'show-selected' : ''
          }`}
        >
          <div className="users-table-container">
            <table className="users-table">
              {searchResults && !isEmpty(searchResults) && (
                <thead className="users-table-header">
                  <tr>
                    <th />
                    <th>Name</th>
                    <th>Qualification</th>
                    <th style={{ textAlign: 'center' }}>Progress</th>
                    <th />
                  </tr>
                </thead>
              )}
              <tbody className="users-table-body">
                {!searchResults && (
                  <tr>
                    <td className="has-text-centered p-25">
                      Begin searching!{' '}
                    </td>
                  </tr>
                )}
                {searchResults && isEmpty(searchResults) && (
                  <tr>
                    <td className="has-text-centered p-25">No results.</td>
                  </tr>
                )}
                {searchResults &&
                  searchResults.map((__, i) => (
                    <tr
                      key={i}
                      className="users-table-row"
                      onClick={() =>
                        userSelected(__, fields.getAll())
                          ? fields.remove(
                              selectedUserIndex(__, fields.getAll())
                            )
                          : fields.push(__)
                      }
                    >
                      <td>
                        <ProgressBadge
                          dimensions={60}
                          strokeWidth={4}
                          innerMargin={1}
                          percentage={path(
                            ['current_qualification', 'progress_percentage'],
                            __
                          )}
                          percentageFontSize={20}
                          image={
                            __.cloudinary_file_id ||
                            'assets/user_card_seat_olhtg1'
                          }
                        />
                      </td>
                      <td>{__.screen_name}</td>
                      <td>{path(['current_qualification', 'title'], __)}</td>
                      <td style={{ textAlign: 'center' }}>
                        {_.current_qualification &&
                          _.current_qualification.progress_percentage(
                            <span>
                              {Math.round(
                                path(
                                  [
                                    'current_qualification',
                                    'progress_percentage'
                                  ],
                                  __
                                )
                              )}
                              %
                            </span>
                          )}
                      </td>
                      <td>
                        <div
                          className={`icon-check ${
                            userSelected(__, fields.getAll()) ? 'selected' : ''
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="selected-members-container">
            <div className="inner">
              {isEmpty(fields.getAll()) ? (
                <div className="empty-view p-25">No users selected.</div>
              ) : (
                fields.getAll().map((__, i) => (
                  <div
                    key={__.member_id}
                    className="selected-member"
                    onClick={() => fields.remove(i)}
                  >
                    <span className="fa fa-times" /> {__.screen_name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    />
  </div>
);

export default GroupLearners;
