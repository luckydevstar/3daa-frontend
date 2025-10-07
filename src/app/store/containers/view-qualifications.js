import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { sum, map, prop, path } from 'ramda';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';

import config from 'brand/config';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import components from '../components';
import { getCourse, getItemCount } from '../utils';

import IconPdfWhite from 'images/icon_pdf_white.svg';

const {
  components: { CloudinaryMedia, UILoading, ConvertDraftObjectToHtml }
} = common;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const {
  StoreHeader,
  StoreStepbar,
  ViewCourseHeader,
  AboutCourse,
  BuildCourseDetails,
  CourseUnitSelector,
  Quantity
} = components;

class ViewQualifications extends Component {
  constructor(props) {
    super(props);

    const mandatory = [];
    const mandatorySelected = {};
    for (let i = 0; i < mandatory.length; i++) {
      mandatorySelected[i] = true;
    }

    const optional = [
      {
        title: 'Not required',
        credit_value: 1
      },
      {
        title: 'Not required',
        credit_value: 2
      }
    ];

    this.state = {
      mandatory,
      mandatorySelected,
      optional,
      optionalSelected: {},
      optionalUnits: 0,
      mandatoryUnits: mandatory.length,
      credits: sum(map(prop('credit'), mandatory)),
      learningHours: 10,
      quantity: 0
    };

    this.mandatoryChanged = this.mandatoryChanged.bind(this);
    this.optionalChanged = this.optionalChanged.bind(this);
    this.handleQuantityUpdate = this.handleQuantityUpdate.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { qualification, getQualificationInStoreAttempt } = this.props;
    console.log(qualification);
    if (
      !qualification ||
      qualification.qualification_id != this.props.params.qualificationId
    ) {
      getQualificationInStoreAttempt(this.props.params.qualificationId, true);
    } else {
      this.setState({ qualification });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { qualification } = nextProps;
    if (qualification) {
    }
  }

  mandatoryChanged(i, unit) {
    const {
      mandatorySelected,
      mandatory,
      credits,
      mandatoryUnits,
      quantity
    } = this.state;
    if (mandatorySelected[i]) {
      this.setState({
        mandatorySelected: {
          ...mandatorySelected,
          [i]: false
        },
        credits: credits - unit.credit_value,
        mandatoryUnits: mandatoryUnits - 1
      });
    } else {
      this.setState({
        mandatorySelected: {
          ...mandatorySelected,
          [i]: true
        },
        credits: credits + unit.credit_value,
        mandatoryUnits: mandatoryUnits + 1
      });
    }
  }

  optionalChanged(i, unit) {
    const { optionalSelected, optional, credits, optionalUnits } = this.state;

    if (optionalSelected[i]) {
      this.setState({
        optionalSelected: {
          ...optionalSelected,
          [i]: false
        },
        credits: credits - unit.credit_value,
        optionalUnits: optionalUnits - 1
      });
    } else {
      this.setState({
        optionalSelected: {
          ...optionalSelected,
          [i]: true
        },
        credits: credits + unit.credit_value,
        optionalUnits: optionalUnits + 1
      });
    }
  }

  handleQuantityUpdate(e) {
    this.setState({ quantity: e });
  }

  onAddToCart(qualification_id, quantity) {
    const { addToCart } = this.props;
    addToCart(qualification_id, quantity);
    browserHistory.push('/store/basket');
  }

  render() {
    const {
      mandatory,
      mandatorySelected,
      mandatoryUnits,
      optional,
      optionalSelected,
      optionalUnits,
      credits,
      quantity
    } = this.state;

    const {
      course,
      count,
      qualification,
      attemptingGetQualificationInStore
    } = this.props;
    const specification = lodash.get(qualification, 'specification');

    return (
      <div className="store view-course">
        <StoreHeader
          title="Store"
          subtitle={`Welcome to the ${config.title} Store`}
          showUploadFileButton={false}
          showBasketButton={true}
        />
        <StoreStepbar steps={['Select Course', 'Basket', 'My Account']} />
        {attemptingGetQualificationInStore ? (
          <UILoading isLoadingOverlay />
        ) : (
          <div className="course-content content-section">
            {qualification ? (
              <div className="container p-t-30 p-b-30">
                <div className="p-b-30">
                  <ViewCourseHeader
                    {...{
                      qualification,
                      count
                    }}
                    addToCart={(qualification_id, quantity) =>
                      this.onAddToCart(qualification_id, quantity)
                    }
                  />
                </div>
                <div className="has-text-centered aim p-t-30">
                  <h2 className="m-b-20">Qualification aim</h2>
                  <div>
                    <ConvertDraftObjectToHtml
                      object={qualification.course_overview}
                      errorMesage="No summary"
                    />
                  </div>
                </div>
                <div className="detail-card p-t-20">
                  <AboutCourse {...{ qualification }} />
                  <div className="p-30">
                    <h2 className="m-b-15">Build your course</h2>
                    <div className="columns m-t-10">
                      <div className="column flex-none">
                        <BuildCourseDetails
                          mandatory={mandatoryUnits}
                          optional={optionalUnits}
                          credits={credits}
                        />
                      </div>
                      <div className="column">
                        <CourseUnitSelector
                          title="Mandatory Units"
                          units={qualification.units}
                          checked={mandatorySelected}
                          onCourseSelect={this.mandatoryChanged}
                        />
                      </div>
                      <div className="column">
                        <CourseUnitSelector
                          title="Optional Units"
                          units={optional}
                          checked={optionalSelected}
                          onCourseSelect={this.optionalChanged}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="detail-card-bottom">
                    <div className="is-flex">
                      <Isvg
                        className="small float-left p-r-15"
                        src={IconPdfWhite}
                      />
                      <div>
                        <div>View Specification</div>
                        {specification && (
                          <div>
                            <a
                              className="view-summary"
                              href={createCloudinaryUrl(specification, 'pdf')}
                            >
                              View
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    {
                      // <div className="is-flex">
                      //   <Quantity
                      //     quantity={quantity}
                      //     onUpdate={this.handleQuantityUpdate}
                      //   />
                      //   <span>Total £{quantity.toFixed(2)}</span>
                      // </div>
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="has-text-centered p-t-45">
                Qualification is not available
              </div>
            )}
          </div>
        )}
        {qualification && !attemptingGetQualificationInStore && (
          <div className="container">
            <div className="has-text-right p-30 p-r-40">
              <Link className="button is-primary" to="/store/basket">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ store }, ownProps) => ({
  course: getCourse(store, ownProps.params.courseId),
  count: getItemCount(store, ownProps.params.courseId),

  attemptingGetQualificationInStore: path([
    'attemptingGetQualificationInStore'
  ])(store),
  qualification: path(['currentQualification'])(store)
});

const mapDispatchToProps = dispatch => ({
  addToCart: (qualification_id, quantity) =>
    dispatch(Actions.addToCart(qualification_id, quantity)),

  getQualificationInStoreAttempt: (qualification_id, view_error) =>
    dispatch(
      Actions.getQualificationInStoreAttempt(qualification_id, view_error)
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewQualifications);
