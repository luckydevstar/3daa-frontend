import React from 'react';
import common from 'app/common';
import Toggle from 'react-toggle';

import { FieldArray } from 'redux-form';
import { isEmpty, find, propEq, findIndex } from 'ramda';

const { components: { SearchBar, ProgressBadge } } = common;

const userSelected = (user, selectedUsers) =>
  find(propEq('registration_number', user.registration_number))(selectedUsers);
const selectedUserIndex = (user, selectedUsers) =>
  findIndex(propEq('registration_number', user.registration_number))(
    selectedUsers
  );

const GroupSeats = ({
  getSearchResults,
  searchTerm,
  searchResults,
  uiSearching,
  uiShowSelected,
  setShowSelected
}) =>
  <div className="group-tutors-container user-selection">
    <div className="columns">
      <div className="column is-three-quarters">
        <SearchBar
          searchPhrase={searchTerm}
          onChange={val => getSearchResults(val, '')}
          searching={uiSearching}
          placeholder="Find user slots"
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
      name="seats"
      component={({ fields }) =>
        <div
          className={`group-members-selection-container ${uiShowSelected
            ? 'show-selected'
            : ''}`}
        >
          <div className="users-table-container">
            <table className="users-table">
              <tbody className="users-table-body">
                {!searchResults &&
                  <tr>
                    <td className="has-text-centered p-25">
                      Begin searching!{' '}
                    </td>
                  </tr>}
                {searchResults &&
                  isEmpty(searchResults) &&
                  <tr>
                    <td className="has-text-centered p-25">No results.</td>
                  </tr>}
                {searchResults &&
                  searchResults.map((__, i) =>
                    <tr
                      key={__.registration_number || i}
                      className="users-table-row"
                      onClick={() =>
                        userSelected(__, fields.getAll())
                          ? fields.remove(
                              selectedUserIndex(__, fields.getAll())
                            )
                          : fields.push(__)}
                    >
                      <td>
                        <ProgressBadge
                          dimensions={60}
                          strokeWidth={4}
                          innerMargin={1}
                          percentage={0} // comming soon
                          percentageFontSize={20}
                          image={
                            __.cloudinary_file_id ||
                            'assets/user_card_seat_olhtg1'
                          }
                        />
                      </td>
                      <td style={{ width: '99%' }}>
                        {__.registration_number}
                      </td>
                      <td>
                        <div
                          className={`icon-check ${userSelected(
                            __,
                            fields.getAll()
                          )
                            ? 'selected'
                            : ''}`}
                        />
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className="selected-members-container">
            <div className="inner">
              {isEmpty(fields.getAll())
                ? <div className="empty-view p-25">No users selected.</div>
                : fields.getAll().map((__, i) =>
                    <div
                      key={__.registration_number}
                      className="selected-member"
                      onClick={() => fields.remove(i)}
                    >
                      <span className="fa fa-times" /> {__.registration_number}
                    </div>
                  )}
            </div>
          </div>
        </div>}
    />
  </div>;

export default GroupSeats;
