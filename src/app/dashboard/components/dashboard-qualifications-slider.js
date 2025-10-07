import React from 'react';
import common from 'app/common';
import Swiper from 'react-id-swiper';
import { Link } from 'react-router';
import { path } from 'ramda';
import { Text } from 'app/intl';

const {
  components: {
    course: { CourseCardFront, CourseCardBack },
    UIFlipper
  }
} = common;

class QualificationsSlider extends React.Component {
  constructor(props) {
    super(props);
    this.swiperConfig = {
      nextButton: null,
      prevButton: null,
      scrollbar: null,
      autoHeight: true,
      paginationType: 'bullets',
      paginationClickable: true,
      pagination: '.swiper-pagination',
      onSlideChangeStart: e => this.setActiveQualification(e.activeIndex),
      onInit: e => this.setActiveQualification(e.activeIndex)
    };
    this.state = {
      activeQualificationId: null
    };
  }

  getQualificationId(index) {
    return path([index, 'qualification_id'])(this.props.centreQualifications);
  }

  setActiveQualification(index) {
    const activeQualificationId = this.getQualificationId(index);
    this.setState({ activeQualificationId });
  }

  render() {
    const { centreQualifications } = this.props;
    const { activeQualificationId } = this.state;
    return !centreQualifications.length ? (
      <div className="not-found-message">
        <Text iKey="msg_could_not_find_qualications" />
      </div>
    ) : (
      <div>
        <div className="your-qualifications-container">
          <Swiper {...this.swiperConfig}>
            {centreQualifications.map((qualification, idx) => {
              const {
                title,
                short_title,
                reference,
                level,
                credit_value,
                minimum_credit,
                guided_learning_hours,
                type,
                groups,
                specification,
                video
              } = qualification;
              return (
                <UIFlipper
                  key={idx}
                  front={
                    <CourseCardFront
                      noDetails
                      {...{
                        title: title,
                        level,
                        fileId: video,
                        mediaType: 'video'
                      }}
                    />
                  }
                  back={
                    <CourseCardBack
                      title={title}
                      reference={reference}
                      qualificationType={type}
                      level={level}
                      credit={credit_value}
                      mandatoryCredit={minimum_credit}
                      guidedLearningHours={guided_learning_hours}
                      assignedGroupsCount={groups}
                      specification={specification}
                    />
                  }
                />
              );
            })}
          </Swiper>
          <div className="has-text-centered qualification-card-controls">
            <Link
              to={
                activeQualificationId
                  ? `/workbooks/qualification-manager/${activeQualificationId}`
                  : '/bookstand'
              }
              className="qualifications-link"
            >
              <button className="button is-primary view-qualification">
                <Text iKey="manage_qualification" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default QualificationsSlider;
