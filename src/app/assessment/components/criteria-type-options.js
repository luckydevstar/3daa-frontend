import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';

import IconInfo from 'images/icon-info.svg';
import IconWorkbookActvity from 'images/workbook_activity_icon.png';
import IconRun from 'images/icon-run.svg';
import IconBrain from 'images/icon-brain.svg';
import IconBinoculars from 'images/icon-binoculars.svg';
import IconQuote from 'images/icon-quote.svg';

class CriteriaTypeOptions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      showOptionHeader,
      activity,
      knowledge,
      observation,
      discussion,
      onChangeOption
    } = this.props;

    return (
      <div
        className="m-b-5"
        style={{ position: 'relative', maxWidth: '120px' }}
      >
        {showOptionHeader && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '120px'
            }}
          >
            <div className="tooltip">
              <Isvg className="small" src={IconRun} />
              <span className="tooltiptext">Activity</span>
            </div>
            <div className="tooltip">
              <Isvg className="small" src={IconBinoculars} />
              <span className="tooltiptext">Knowledge</span>
            </div>
            <div className="tooltip">
              <i className="fa fa-eye" />
              <span className="tooltiptext">Observation</span>
            </div>
            <div className="tooltip">
              <Isvg className="small" src={IconQuote} />
              <span className="tooltiptext">Discussion</span>
            </div>
          </div>
        )}

        <div
          className="is-flex"
          style={{
            justifyContent: 'space-between',
            maxWidth: '115px',
            marginLeft: 'auto'
          }}
        >
          <label className="custom checkbox m-l-0 m-r-0">
            <input
              type="checkbox"
              value="activity"
              checked={activity}
              onChange={e => {
                onChangeOption('activity', e);
              }}
            />
            <span className="ui m-r-0" />
          </label>
          <label className="custom checkbox m-l-0 m-r-0">
            <input
              type="checkbox"
              value="knowledge"
              checked={knowledge}
              onChange={e => {
                onChangeOption('knowledge', e);
              }}
            />
            <span className="ui m-r-0" />
          </label>
          <label className="custom checkbox m-l-0 m-r-0">
            <input
              type="checkbox"
              value="observation"
              checked={observation}
              onChange={e => {
                onChangeOption('observation', e);
              }}
            />
            <span className="ui m-r-0" />
          </label>
          <label className="custom checkbox m-l-0 m-r-0">
            <input
              type="checkbox"
              value="discussion"
              checked={discussion}
              onChange={e => {
                onChangeOption('discussion', e);
              }}
            />
            <span className="ui m-r-0" />
          </label>
        </div>
      </div>
    );
  }
}

CriteriaTypeOptions.propTypes = {
  showOptionHeader: PropTypes.bool,

  activity: PropTypes.bool,
  knowledge: PropTypes.bool,
  observation: PropTypes.bool,
  discussion: PropTypes.bool,

  onChangeOption: PropTypes.func
};

CriteriaTypeOptions.defaultProps = {
  showOptionHeader: true,

  activity: false,
  knowledge: false,
  observation: false,
  discussion: false,

  onChangeOption: (option, e) => {}
};

export default CriteriaTypeOptions;
