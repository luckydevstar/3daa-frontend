import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { addIndex, any, equals, map, or, isEmpty } from 'ramda';
import * as lodash from 'lodash';

import SelectedItem from './selected-item';

class SelectedItemList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items, className, onClose } = this.props;

    return (
      <div className={classNames('selected-item-list', className)}>
        {items &&
          items.map((item, i) => (
            <SelectedItem
              key={'selected' + i}
              name={lodash.get(item, 'screen_name', '')}
              fileId={lodash.get(item, 'cloudinary_file_id', '')}
              showAvatar={lodash.get(item, 'showAvatar', '')}
              showPdfIcon={lodash.get(item, 'showPdfIcon', '')}
              showTtrainingIcon={lodash.get(item, 'showTtrainingIcon', '')}
              onClose={() => onClose(item)}
            />
          ))}
      </div>
    );
  }
}

SelectedItemList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  onClose: () => {}
};

SelectedItemList.defaultProps = {
  className: '',
  items: [],
  onClose: () => {}
};

export default SelectedItemList;
