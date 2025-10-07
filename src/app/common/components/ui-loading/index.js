import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const UILoading = props => {
  const {
    isAppOverlay,
    isLoadingOverlay,
    largeIcon,
    alignMiddle,
    customClass,
    minHeight,
    marginTop,
    marginBottom,
    spinnerRef,
    height100vh
  } = props;
  const co = classNames('ui-component-loading', {
    'app-loading-overlay': isAppOverlay,
    'loading-overlay': isLoadingOverlay,
    'align-children-middle': alignMiddle,
    'loading-height-100vh': height100vh
  });
  const cx = classNames('loading-spinner', customClass, {
    large: largeIcon
  });
  return (
    <div className={co} style={{ minHeight, marginTop, marginBottom }}>
      <div className={cx} ref={spinnerRef} />
    </div>
  );
};

UILoading.propTypes = {
  isAppOverlay: PropTypes.bool,
  isLoadingOverlay: PropTypes.bool,
  largeIcon: PropTypes.bool,
  customClass: PropTypes.string,
  minHeight: PropTypes.string,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  spinnerRef: PropTypes.func,
  height100vh: PropTypes.bool
};

UILoading.defaultProps = {
  isAppOverlay: false,
  isLoadingOverlay: false,
  largeIcon: false,
  alignMiddle: false,
  customClass: '',
  minHeight: '',
  marginTop: '',
  marginBottom: '',
  spinnerRef: null,
  height100vh: false
};

export default UILoading;
