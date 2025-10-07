import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { path } from 'ramda';
import { getQualificationIndex } from '../../util/helpers';
import CarouselItem from './carousel-item';

class QualificationsCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataContainerWidth: null,
      currentPage: getQualificationIndex(
        props.initialQualificationId,
        props.qualifications
      )
    };
  }

  UNSAFE_componentWillMount() {
    document.addEventListener('keyup', e => this.handleKeyUp(e));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextIndex = getQualificationIndex(
      nextProps.qualificationID,
      nextProps.qualifications
    );
    if (nextProps.qualifications.length !== this.props.qualifications.length) {
      this.setState({
        currentPage: getQualificationIndex(
          nextProps.initialQualificationId,
          nextProps.qualifications
        )
      });
    }

    if (nextProps.qualificationID && this.state.currentPage !== nextIndex) {
      this.setState({ currentPage: nextIndex });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', () => null);
  }

  setDataContainerWidth(dataContainerWidth) {
    // set width only once
    if (
      this.state.dataContainerWidth === null ||
      this.state.dataContainerWidth === 0
    ) {
      this.setState({ dataContainerWidth });
    }
  }

  handleKeyUp({ key }) {
    const { currentPage } = this.state;
    switch (key) {
      case 'ArrowRight':
        this.changePage(currentPage + 1);
        break;
      case 'ArrowLeft':
        this.changePage(currentPage - 1);
        break;
      default:
        break;
    }
  }

  changePage(nextPage, customQuals) {
    const { onQualificationChange } = this.props;
    const qualifications = customQuals || this.props.qualifications;
    if (nextPage >= 0 && nextPage < qualifications.length) {
      this.setState({ currentPage: nextPage }, () => {
        onQualificationChange(
          customQuals ? customQuals[nextPage] : qualifications[nextPage]
        );
      });
    }
  }

  isFaded(index) {
    const { currentPage } = this.state;
    return index === currentPage + 1 || index === currentPage - 1;
  }

  isHidden(index) {
    const { currentPage } = this.state;
    return index > currentPage + 1 || index < currentPage - 1;
  }

  isActive(index) {
    return this.state.currentPage === index;
  }

  renderCourseCard(
    {
      qualification_id,
      video,
      title,
      short_title,
      progress_percentage,
      level,
      overview,
      pathway,
      pathways,
      credit_value,
      credits_earned,
      units_complete,
      workbooks,
      specification
    },
    index
  ) {
    const activePathway = path(['qualificationDetails', 'activePathway'])(
      this.props
    );
    const {
      qualificationDetails,
      qualManager,
      managerProgress,
      onPathwayChange,
      activePathwayCta,
      groups
    } = this.props;
    const { credits, optional, mandatory } = qualificationDetails || {};

    const { dataContainerWidth } = this.state;

    return (
      <CarouselItem
        key={qualification_id}
        setDataContainerWidth={width => this.setDataContainerWidth(width)}
        qualificationId={qualification_id}
        fileId={video}
        title={title}
        percentage={
          (this.isActive(index) && managerProgress) || progress_percentage
        }
        mediaType="video"
        thumbnail={!this.isActive(index)}
        className={classNames({
          faded: this.isFaded(index),
          hidden: this.isHidden(index)
        })}
        isActive={this.isActive(index)}
        pathway={pathway || null}
        pathways={pathways || null}
        onClick={() => {
          return this.isFaded(index) ? this.changePage(index) : null;
        }}
        activePathwayCta={this.isActive(index) ? activePathwayCta : {}}
        onPathwayChange={onPathwayChange}
        {...{
          activePathway,
          credits,
          optional,
          mandatory,
          specification,
          qualManager,
          level,
          overview,
          dataContainerWidth,
          groups,
          unitsComplete: [
            units_complete || 0,
            (workbooks && workbooks.length) || 0
          ],
          creditsEarned: [credits_earned || 0, credit_value || 0]
        }}
      />
    );
  }

  render() {
    const { currentPage } = this.state;
    const { qualifications } = this.props;
    return (
      <div className="qualification-carousel">
        <div
          disabled={currentPage <= 0}
          className="button-navigation  button-navigation-previous"
          onClick={() => this.changePage(currentPage - 1)}
        />
        <div className="qualification-carousel-items column is-10">
          {qualifications.map((qualification, index) => {
            if (index >= currentPage - 2 && index <= currentPage + 2) {
              return this.renderCourseCard(qualification, index);
            }
            return null;
          })}
        </div>
        <div
          disabled={currentPage >= qualifications.length - 1}
          className="button-navigation  button-navigation-next"
          onClick={() => this.changePage(currentPage + 1)}
        />
      </div>
    );
  }
}

QualificationsCarousel.propTypes = {
  qualifications: PropTypes.array.isRequired,
  onQualificationChange: PropTypes.func.isRequired,
  qualManager: PropTypes.bool,
  initialPage: PropTypes.number
};

QualificationsCarousel.defaultProps = {
  qualManager: false,
  initialPage: 0
};

export default QualificationsCarousel;
