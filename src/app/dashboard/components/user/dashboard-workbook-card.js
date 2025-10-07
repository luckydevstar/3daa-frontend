import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import { Link } from 'react-router';

const {
  components: { CloudinaryMedia, ProgressBadge }
} = common;

const DashboardWorkbookCard = ({
  cover,
  credit,
  overview,
  progress,
  title,
  workbook_id,
  unit_id,
  glh
}) => {
  const commas = overview.length > 280 ? ' ...' : '';
  const workbookContent = overview.slice(0, 280) + commas;

  return (
    <div className="workbook-card">
      <div className="wb-title">{title}</div>
      <div className="columns wb-option">
        <p className="column is-7">
          <b>GLH:</b> {glh}
        </p>
        <p className="column is-5">
          <b>Credit Value:</b>
          {` ${credit}`}
        </p>
      </div>
      <div className="columns">
        <div className="column workbooks is-7">
          <CloudinaryMedia
            style={{
              height: 230
            }}
            fileId={cover}
            transformations={{
              width: 160,
              height: 230,
              crop: 'fill',
              gravity: 'north',
              quality: 100
            }}
          />
          <div className="progress-badge">
            <ProgressBadge
              dimensions={60}
              strokeWidth={5}
              percentage={progress}
              strokeColorSecondary="rgba(255, 255, 255, .1)"
              percentageFontSize={20}
              labelFontSize={14}
            />
          </div>
        </div>
        <div className="column workbook-desc is-5">
          <div className="wb-desc">{workbookContent}</div>
        </div>
      </div>
      <div className="buttons">
        <Link
          to={
            unit_id && workbook_id
              ? `/bookstand/preview/${unit_id}/${workbook_id}`
              : `/bookstand`
          }
          className="button is-primary"
        >
          Continue Workbook
        </Link>
      </div>
    </div>
  );
};

DashboardWorkbookCard.propTypes = {
  cover: PropTypes.string,
  credit: PropTypes.number,
  overview: PropTypes.string,
  progress: PropTypes.number,
  title: PropTypes.string,
  workbook_id: PropTypes.number,
  unit_id: PropTypes.number
};

DashboardWorkbookCard.defaultProps = {
  cover: '',
  credit: 0,
  overview: '',
  progress: 0,
  title: '',
  workbook_id: 0,
  unit_id: 0
};

export default DashboardWorkbookCard;
