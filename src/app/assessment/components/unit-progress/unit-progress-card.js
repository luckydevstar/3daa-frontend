import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';
import common from 'app/common';
import Isvg from 'react-inlinesvg';

class UnitProgressCard extends Component {
  render() {
    const { unit, isActive } = this.props;
    const marks = lodash.range(0, lodash.get(unit, 'quality_score', 0));
    const title = lodash.get(unit, 'title', '');

    return (
      <div className={classNames('unit-progress-card', { active: isActive })}>
        <div className="unit-progress-card-title border-bottom pb-4">
          <p className="m-b-10">{lodash.get(unit, 'unit_reference', '')}</p>
          <p className="unit-title">
            {title.length > 50 ? `${title.slice(0, 47)}...` : title}
          </p>
        </div>

        <div className="infos border-top">
          <p className="ap">
            <i className="fa fa-circle m-r-5" /> AP:{' '}
            {lodash.get(unit, 'assessment_progress', '')}%
          </p>
          <p className="iqa" />
          <div className="stars has-text-centered">
            {marks.map((mark, i) => {
              return <i key={i} className="fa fa-star" />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

UnitProgressCard.propTypes = {
  item: PropTypes.object.isRequired,
  isActive: PropTypes.bool
};

UnitProgressCard.defaultProps = {
  item: {},
  isActive: false
};

export default UnitProgressCard;

// <i className="fa fa-circle m-r-5" /> IQA:{' '}
//             {lodash.get(unit, 'iqa_progress', '')}%
