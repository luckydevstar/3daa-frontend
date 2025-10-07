import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import common from 'app/common';
import cx from 'classnames';
import { Text } from 'app/intl';
import { createCloudinaryUrl } from 'app/common/util/helpers';

const {
  components: { ExpandableButton }
} = common;

const WorkbooksHeader = ({
  title,
  subtitle,
  backButtonLink,
  expandableButtonProps,
  handleCohortClick,
  attemptingMapQualification,
  sector
}) => {
  return (
    <section
      className="content-section hero smaller gray"
      style={{
        backgroundImage:
          sector && sector.image
            ? `url(${createCloudinaryUrl(sector.image, 'image')}`
            : null,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-body">
        <div className="container">
          <div className="media">
            {backButtonLink && (
              <div className="media-left">
                <Link className="back-button" onClick={browserHistory.goBack} />
              </div>
            )}
            <div className="media-right">
              <h1 className="title">
                <Text iKey={title} />
              </h1>
              <h2 className="subtitle">
                <Text iKey={subtitle} />
              </h2>
              {expandableButtonProps && (
                <div className="hero-nav">
                  <ExpandableButton {...expandableButtonProps} />
                </div>
              )}
              {handleCohortClick && (
                <div className="hero-nav">
                  <div
                    className={cx(
                      'button',
                      'is-primary',
                      'is-outlined',
                      'cohort',
                      {
                        'is-loading': attemptingMapQualification
                      }
                    )}
                    onClick={() => handleCohortClick()}
                  >
                    <Text iKey="add_to_cohort" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

WorkbooksHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backButtonLink: PropTypes.string,
  expandableButtonProps: PropTypes.object,
  attemptingMapQualification: PropTypes.bool,
  handleCohortClick: PropTypes.func
};

WorkbooksHeader.defaultProps = {
  title: 'bookstand',
  subtitle: 'learning_and_activity_material',
  backButtonLink: null,
  expandableButtonProps: undefined,
  attemptingMapQualification: false,
  handleCohortClick: null
};

export default WorkbooksHeader;
