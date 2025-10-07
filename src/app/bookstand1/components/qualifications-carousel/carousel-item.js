import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import cx from 'classnames';

import { Text, Option } from 'app/intl';

const {
  components: {
    CloudinaryMedia,
    ProgressBadge,
    ConvertDraftObjectToHtml,
    QualificationStatus
  }
} = common;

class CarouselItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offsetWidth: null,
      offsetHeight: null
    };
  }

  componentDidMount() {
    if (!this.props.thumbnail) {
      this.props.setDataContainerWidth(this.dataWrapper.offsetWidth);
    }
  }

  getWordByNumber(number) {
    return (
      ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'][number] ||
      number
    );
  }

  render() {
    const {
      level,
      title,
      groups,
      overview,
      className,
      percentage,
      imageDimensions,
      onPathwayChange,
      qualManager,
      thumbnail,
      fileId,
      mediaType,
      credits,
      optional,
      unitsComplete,
      creditsEarned,
      mandatory,
      isActive,
      pathways,
      specification,
      qualificationId,
      activePathwayCta,
      activePathway,
      onClick
    } = this.props;

    const { editPathway, deletePathway, createPathway } = activePathwayCta;

    return (
      <div
        className={cx('carousel-card', className)}
        style={{ height: imageDimensions && imageDimensions.height }}
        onClick={onClick}
      >
        <div className="carousel-media">
          {fileId && (
            <CloudinaryMedia
              style={{ ...imageDimensions }}
              mediaType={mediaType}
              fileId={fileId}
              attributes={{ autoPlay: true, loop: true }}
              thumbnail={thumbnail}
              transformations={{
                width: imageDimensions && imageDimensions.width * 2,
                height: imageDimensions && imageDimensions.height * 2,
                crop: 'fill',
                gravity: 'north',
                quality: 100
              }}
            />
          )}
          <div className="title">{title}</div>
        </div>
        <div className="carousel-separator">
          <div className="progress-badge">
            <ProgressBadge
              dimensions={70}
              strokeWidth={5}
              percentage={percentage}
              innerMargin={0}
            />
          </div>
        </div>
        <div
          ref={el => {
            this.dataWrapper = el;
          }}
          className="carousel-data"
        >
          <div className="carousel-data-header">
            <div className="qualification-title">
              {title && title.length > 80 ? `${title.slice(0, 77)}...` : title}
            </div>
            <div className="level-badge is-hidden-touch">
              <Text iKey="level" /> <Text iKey={this.getWordByNumber(level)} />
            </div>
          </div>
          {qualManager && (
            <div className="pathway-controls">
              <p className="control">
                <span className="select">
                  <select
                    onChange={e => onPathwayChange(e)}
                    value={activePathway || 0}
                    disabled={!isActive}
                  >
                    <Option iKey="general_pathway" value={qualificationId} />
                    {pathways &&
                      pathways.length > 0 &&
                      pathways.map(pw => (
                        <option
                          key={pw.qualification_id}
                          value={pw.qualification_id}
                        >
                          {pw.pathway}
                        </option>
                      ))}
                  </select>
                </span>
              </p>
              <div className="cta">
                {activePathway ? (
                  <div className="cta-wrapper">
                    <i className="fa fa-pencil" onClick={editPathway} />
                    <i
                      className="fa fa-trash-o"
                      onClick={() => deletePathway(activePathway)}
                    />
                  </div>
                ) : (
                  <div className="add-button" onClick={createPathway}>
                    +
                  </div>
                )}
              </div>
            </div>
          )}
          {qualManager && (
            <div className="assigned-groups">
              {`${groups} `}
              <Text iKey="assigned_groups" />
            </div>
          )}

          <div
            className="overview is-hidden-mobile"
            style={{ maxHeight: qualManager ? 80 : 200 }}
          >
            {<ConvertDraftObjectToHtml object={overview} />}
          </div>
          <QualificationStatus
            {...{
              mandatory,
              optional,
              credits,
              specification,
              creditsEarned,
              unitsComplete,
              admin: qualManager
            }}
          />
        </div>
      </div>
    );
  }
}

CarouselItem.propTypes = {
  title: PropTypes.string,
  level: PropTypes.number,
  overview: PropTypes.string,
  percentage: PropTypes.number,
  imageDimensions: PropTypes.object,
  thumbnail: PropTypes.bool,
  fileId: PropTypes.string,
  mediaType: PropTypes.oneOf(['video', 'image']),
  groups: PropTypes.number,
  credits: PropTypes.array,
  optional: PropTypes.array,
  mandatory: PropTypes.array,
  specificationFileId: PropTypes.string,
  setDataContainerWidth: PropTypes.func,
  onPathwayChange: PropTypes.func,
  qualificationId: PropTypes.number,
  activePathway: PropTypes.number,
  isActive: PropTypes.bool,
  pathways: PropTypes.array,
  activePathwayCta: PropTypes.object,
  unitsComplete: PropTypes.array,
  creditsEarned: PropTypes.array
};

CarouselItem.defaultProps = {
  title:
    'Certificate in Hospitality and Catering Principles (Professional Cookery)',
  level: 0,
  overview: null,
  percentage: 0,
  imageDimensions: {
    width: 210,
    height: 390
  },
  thumbnail: true,
  groups: 0,
  fileId: null,
  mediaType: 'video',
  credits: [0, 0],
  optional: [0, 0],
  mandatory: [0, 0],
  unitsComplete: [0, 0],
  creditsEarned: [0, 0],
  qualificationId: null,
  specificationFileId: null,
  isActive: false,
  activePathway: null,
  pathways: [],
  setDataContainerWidth: () => null,
  onPathwayChange: () => null,
  activePathwayCta: {
    assignToGroups: () => null,
    editPathway: () => null,
    deletePathway: () => null,
    createPathway: () => null
  }
};

export default CarouselItem;
