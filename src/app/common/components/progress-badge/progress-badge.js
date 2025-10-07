import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CloudinaryMedia from '../cloudinary-media';
import { Text } from 'app/intl';

const ProgressBadge = props => {
  const {
    percentage,
    percentageFontSize,
    image,
    label,
    completeLabel,
    labelFontSize,
    labelFontColor,
    dimensions,
    overridePercentage,
    innerShadow,
    hasHover
  } = props;

  const isCompleted = () => {
    return props.percentage === 100;
  };

  const getTickDimensions = () => {
    const widthHeightRatio = 1.31;
    const tickSizeRatio = completeLabel ? 0.25 : 0.3;
    const height = Math.round(dimensions * tickSizeRatio);
    const width = Math.round(height * widthHeightRatio);
    return {
      width,
      height
    };
  };

  const getPercentage = () => {
    const renderedPercentage =
      typeof overridePercentage === 'undefined' ? (
        <span>
          {isCompleted() ? (
            <div className="tick-icon" style={getTickDimensions()} />
          ) : (
            Math.round(percentage)
          )}
          <span
            style={{ fontSize: percentageFontSize * 0.6 }}
            className="progress-percent"
          >
            {!isCompleted() && '%'}
          </span>
        </span>
      ) : (
        overridePercentage
      );

    return (
      <span
        style={{
          fontSize: percentageFontSize,
          lineHeight: `${percentageFontSize}px`
        }}
        className="progress-number"
      >
        {renderedPercentage}
      </span>
    );
  };

  const numbersAsBackground = (
    <div className="progress-label-wrapper-hover">{getPercentage()}</div>
  );

  const renderInner = () => {
    if (typeof image !== 'undefined') {
      return (
        <div>
          {image && (
            <CloudinaryMedia
              fileId={image}
              mediaType="image"
              transformations={{
                width: dimensions,
                height: dimensions,
                crop: 'thumb',
                gravity: 'face'
              }}
            />
          )}
          {hasHover && numbersAsBackground}
        </div>
      );
    }

    if (typeof label !== 'undefined') {
      return (
        <div
          className="progress-label-wrapper"
          style={{ flexDirection: 'column' }}
        >
          {getPercentage()}
          <span
            style={{ fontSize: labelFontSize, color: labelFontColor }}
            className="progress-label"
          >
            <Text iKey={label} />
          </span>
        </div>
      );
    }

    if (completeLabel) {
      return (
        <div
          className="progress-label-wrapper"
          style={{ flexDirection: percentage >= 100 ? 'column' : 'row' }}
        >
          {getPercentage()}
          {percentage >= 100 && (
            <span
              style={{ fontSize: labelFontSize, color: labelFontColor }}
              className="progress-label m-t-5"
            >
              {completeLabel}
            </span>
          )}
        </div>
      );
    }

    if (typeof percentage !== 'undefined') {
      return <div className="progress-label-wrapper">{getPercentage()}</div>;
    }

    return null;
  };

  const getInnerStyles = () => {
    const { innerMargin } = props;
    let { strokeWidth } = props;
    strokeWidth = isCompleted() ? strokeWidth + 1 : strokeWidth;
    const innerMarginWhenComplete = 2;
    const size = `${dimensions -
      strokeWidth * 2 -
      (isCompleted() ? innerMarginWhenComplete : innerMargin) * 2}px`;
    const offset = `${strokeWidth +
      (isCompleted() ? innerMarginWhenComplete : innerMargin)}px`;
    return {
      width: size,
      height: size,
      top: offset,
      left: offset
    };
  };

  let { strokeWidth } = props;
  strokeWidth = isCompleted() ? strokeWidth + 1 : strokeWidth;

  const strokeDasharray = (dimensions - strokeWidth) * Math.PI;
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray / 100) * percentage;
  const radius = (dimensions - strokeWidth) / 2;
  const isFirefox = typeof InstallTrigger !== 'undefined';
  const innerClassnames = cx({
    'progress-badge-inner': true,
    shadow: innerShadow,
    completed: isCompleted()
  });

  return (
    <div
      className="progress-badge-container"
      style={{ width: dimensions, height: dimensions }}
    >
      <svg className="progress-badge-svg">
        <circle
          className="svg-bg-default"
          r={radius}
          style={{
            transform: `rotate(-90deg) translate(${
              isFirefox ? '' : '-'
            }${dimensions / 2}px, ${dimensions / 2}px)`
          }}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="svg-bg-fill"
          r={radius}
          style={{
            transform: `rotate(-90deg) translate(${
              isFirefox ? '' : '-'
            }${dimensions / 2}px, ${dimensions / 2}px)`
          }}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      <div className={innerClassnames} style={getInnerStyles()}>
        {renderInner()}
      </div>
    </div>
  );
};

ProgressBadge.propTypes = {
  dimensions: PropTypes.number,
  strokeWidth: PropTypes.number,
  percentage: PropTypes.number,
  innerMargin: PropTypes.number,
  percentageFontSize: PropTypes.number,
  labelFontSize: PropTypes.number,
  innerShadow: PropTypes.bool,
  completeLabel: PropTypes.string
};

ProgressBadge.defaultProps = {
  dimensions: 70,
  strokeWidth: 5,
  innerMargin: 5,
  percentage: 0,
  percentageFontSize: 22,
  labelFontSize: 12,
  completeLabel: null,
  innerShadow: false
};

export default ProgressBadge;
