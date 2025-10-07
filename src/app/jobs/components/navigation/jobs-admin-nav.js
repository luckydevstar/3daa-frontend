import React from 'react';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';
import { Text } from 'app/intl';

import IconCardView from 'images/icon_card_view.svg';
import IconListView from 'images/icon_list_view.svg';

const AdminNav = ({ viewMethod, toggleViewMethod, isViewMode }) => (
  <div className="tabs is-fullwidth jobs-navs">
    <ul>
      <li>
        <span className="icon">
          <i className="fa fa-search" />
        </span>
        <span className="text">Search</span>
      </li>
      <li>
        <span className="text">Date Added</span>
        <span className="icon">
          <i className="fa fa-angle-down" />
        </span>
      </li>
      {isViewMode && (
        <li
          className={classNames('view-option', {
            active: viewMethod
          })}
          onClick={toggleViewMethod}
        >
          <Text iKey="card_view" />
          <Isvg src={IconCardView} />
        </li>
      )}
      {isViewMode && (
        <li
          className={classNames('view-option', {
            active: !viewMethod
          })}
          onClick={toggleViewMethod}
        >
          <Text iKey="list_view" />
          <Isvg src={IconListView} />
        </li>
      )}
    </ul>
  </div>
);

export default AdminNav;
