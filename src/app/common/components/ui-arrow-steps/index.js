import React from 'react';
import PropTypes from 'prop-types';
import { cond, equals, gt, T, always } from 'ramda';
import * as lodash from 'lodash';

const UIArrowSteps = ({
  steps,
  active,
  width,
  height,
  colors,
  horizontalBorders
}) => {
  const h2 = height / 2;
  const h3 = height / 3;
  const newHeight = horizontalBorders ? height + 2 : height;
  const count = lodash.max([lodash.size(steps), 3]);

  const bgColor = cond([
    [gt(active), always(colors.completedBg)],
    [equals(active), always(colors.selectedBg)],
    [T, always(colors.incompletedBg)]
  ]);
  const textColor = cond([
    [gt(active), always(colors.completedText)],
    [equals(active), always(colors.selectedText)],
    [T, always(colors.incompletedText)]
  ]);

  return (
    <div className="ui-arrow-steps">
      <svg width={width * count + h3 + 2} height={newHeight}>
        {steps.map((step, i) => {
          const x = width * i + 2;
          let d0;
          let d1;
          if (horizontalBorders) {
            d0 = `M ${x} 1 L ${x + h3} ${h2 + 1} L ${x} ${height + 1}
                  L ${x + width} ${height + 1} L ${x + width + h3} ${h2 + 1}
                  L ${x + width} 1 L ${x} 1`;
          } else {
            d0 = `M ${x} 0 L ${x + h3} ${h2} L ${x} ${height}
                  L ${x + width} ${height} L ${x + width + h3} ${h2}
                  L ${x + width} 0 L ${x} 0`;
            d1 = `M ${x} 0 L ${x + h3} ${h2} L ${x} ${height}
                  M ${x + width} ${height} L ${x + width + h3} ${h2}
                  L ${x + width} 0`;
          }

          return (
            <g key={i}>
              {horizontalBorders ? (
                <path
                  d={d0}
                  stroke="#ced6dd"
                  strokeWidth="1"
                  fill={bgColor(i)}
                />
              ) : (
                <g>
                  <path d={d0} fill={bgColor(i)} />
                  <path d={d1} stroke="#ced6dd" strokeWidth="1" fill="none" />
                </g>
              )}
              <text
                x={x + (h3 + width) / 2}
                y={h2 + 6}
                textAnchor="middle"
                style={{
                  fontWeight: '600'
                }}
                fill={textColor(i)}
              >
                {step}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

UIArrowSteps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.shape({
    selectedBg: PropTypes.string,
    selectedText: PropTypes.string,
    completedBg: PropTypes.string,
    completedText: PropTypes.string,
    incompletedBg: PropTypes.string,
    incompletedText: PropTypes.string
  }),
  active: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  horizontalBorders: PropTypes.bool
};

UIArrowSteps.defaultProps = {
  steps: [],
  colors: {
    selectedBg: '#CFDC00',
    selectedText: 'black',
    completedBg: '#E1DEE2',
    completedText: 'white',
    incompletedBg: 'white',
    incompletedText: 'black'
  },
  active: 0,
  width: 180,
  height: 50,
  horizontalBorders: true
};

export default UIArrowSteps;
