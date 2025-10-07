import React, { Component } from 'react';
import { addIndex, any, equals, map, or, isEmpty } from 'ramda';
import common from 'app/common';

import Isvg from 'react-inlinesvg';

import IconTraining from 'images/icon_training.svg';
import IconTraining1 from 'images/icon_training1.svg';
import IconWorkbook from 'images/icon_workbooks_fat_grey.svg';
import IconPDF from 'images/icon_pdf_white.svg';

const ProfileAvatar = common.components.ProfileAvatar;

const ItemTag = ({ whatFor, item, onClose, index }) => (
  <li className="m-b-5">
    <div className="is-flex" style={{ alignItems: 'center' }}>
      <div className="selected-item">
        {item.first_name ? (
          <span className="m-r-5">
            {item.first_name + ' ' + item.last_name}
          </span>
        ) : (
          <span className="m-r-5">
            {item.profile_name || item.screen_name || item.title}
          </span>
        )}
        <i
          className="fa fa-close"
          style={{ cursor: 'pointer' }}
          onClick={() => onClose(item)}
        />
      </div>
      <div className="m-l-15">
        {whatFor == 'inviites' && item.cloudinary_file_id && (
          <ProfileAvatar
            avatarSize={70}
            title={item.profile_name}
            fileId={item.cloudinary_file_id}
          />
        )}

        {whatFor == 'centre' && <Isvg src={IconTraining} />}

        {whatFor == 'qualification' && <Isvg src={IconPDF} />}
      </div>
    </div>
  </li>
);

const mapIndexed = addIndex(map);

class CommuntyInviteSelectedItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { whatFor, items, onClose } = this.props;

    return (
      <div className="react-tags">
        <ul className="react-tags__container">
          {items &&
            items.length > 0 &&
            mapIndexed(
              (item, index) => (
                <ItemTag
                  {...{
                    key: index,
                    whatFor,
                    item,
                    onClose,
                    index
                  }}
                />
              ),
              items
            )}
        </ul>
      </div>
    );
  }
}

export default CommuntyInviteSelectedItems;
