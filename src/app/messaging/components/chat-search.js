import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import cx from 'classnames';

const SearchBar = common.components.SearchBar;
const noop = common.util.helpers.noop;

const ChatSearch = ({
  onBack,
  onChange,
  onEnter,
  placeholder,
  searchPhrase,
  side
}) => {
  const cname = cx('chat-search', {
    'app-sidebar-pane__header': side
  });

  return (
    <div className={cname}>
      {onBack && <button className="backarrow" onClick={onBack} />}
      <SearchBar
        {...{
          onChange,
          onEnter,
          placeholder,
          searchPhrase
        }}
      />
    </div>
  );
};

ChatSearch.propTypes = {
  onBack: PropTypes.func,
  onEnter: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  searchPhrase: PropTypes.string,
  side: PropTypes.bool
};

ChatSearch.defaultProps = {
  onBack: null,
  onEnter: noop,
  onChange: noop,
  placeholder: 'Search',
  searchPhrase: '',
  side: false
};

export default ChatSearch;
