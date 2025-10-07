import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Text } from 'app/intl';

const CategoriesAddCard = ({ itemClass, toggleAddCategory }) => (
  <li className={cx(itemClass, 'video-tab__add-media column')}>
    <button
      className="video-tab__add-media-btn button hoverable image is-fullwidth"
      style={{ height: '100%' }}
      onClick={toggleAddCategory}
    >
      <div className="video-tab__add-media-label is-centered ">
        <Text iKey="add_category" />{' '}
        <i
          className="video-tab__add-media-icon fa fa-plus-circle"
          aria-hidden="true"
        />
      </div>
    </button>
  </li>
);

CategoriesAddCard.propTypes = {
  toggleAddCategory: PropTypes.func.isRequired
};

export default CategoriesAddCard;
