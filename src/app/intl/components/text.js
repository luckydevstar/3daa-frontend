import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { split, map, addIndex } from 'ramda';
import { _t } from '../helper';

const Text = ({ iKey, vals, lang, translateValue }) => {
  if (vals) {
    const strArr = split('%s', _t(iKey, lang));
    const mapIndexed = addIndex(map);
    return (
      <span>
        {mapIndexed(
          (str, i) => (
            <span key={`${iKey}-${i}`}>
              {str}
              {translateValue && vals[i] ? _t(vals[i], lang) : vals[i]}
            </span>
          ),
          strArr
        )}
      </span>
    );
  }

  return <span>{_t(iKey, lang)}</span>;
};

Text.propTypes = {
  iKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vals: PropTypes.array,
  translateValue: PropTypes.bool
};

Text.defaultProps = {
  iKey: '',
  vals: null,
  translateValue: false
};

const mapStateToProps = ({ persisted: { lang } }) => ({ lang });

export default connect(mapStateToProps, null)(Text);
