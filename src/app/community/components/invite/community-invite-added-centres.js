import React, { Component } from 'react';
import { addIndex, any, equals, map, or, isEmpty } from 'ramda';
import { RoleNameMap } from 'app/core/config/constants';
import { Text } from 'app/intl';

import Isvg from 'react-inlinesvg';
import IconRemove from 'images/icon_remove.svg';

const ItemTag = ({ userType, item, onClose, index }) => (
  <li className="m-b-5">
    <div className="added-item">
      <div className="user-type">
        <Text iKey={RoleNameMap[userType]} />
        &nbsp;&nbsp;selected
      </div>
      <div className="center-name">{item.screen_name}</div>
      <div
        className="is-flex"
        style={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div className="email">{item.contact_email}</div>
        <div>
          <a onClick={() => onClose(item)}>
            <Isvg src={IconRemove} />
          </a>
        </div>
      </div>
    </div>
  </li>
);

const mapIndexed = addIndex(map);

class CommuntyInviteAddedCentres extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { userType, items, searchQuery, onClose } = this.props;
    let filteredItems = items;
    if (searchQuery) {
      const phrase = searchQuery.trim().toLowerCase();
      filteredItems = items.filter(
        item => item.screen_name.toLowerCase().indexOf(phrase) >= 0
      );
    }

    return (
      <div className="added-items">
        <ul>
          {filteredItems &&
            filteredItems.length > 0 &&
            mapIndexed(
              (item, index) => (
                <ItemTag
                  {...{
                    key: index,
                    userType,
                    item,
                    onClose,
                    index
                  }}
                />
              ),
              filteredItems
            )}
        </ul>
      </div>
    );
  }
}

export default CommuntyInviteAddedCentres;
