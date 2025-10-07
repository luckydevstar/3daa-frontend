import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'app/intl';

class EmptyView extends Component {
  constructor(props) {
    super(props);

    this.typesData = {
      qualifications: {
        icons: Array(3).fill('icon-workbook'),
        title: <Text iKey="msg_no_qualifications_in_this_sector" />,
        description: "Looks like there isn't much content here yet."
      },
      workbooks: {
        icons: Array(3).fill('icon-workbook'),
        title: 'No Workbooks yet',
        button: 'Contact Centre',
        description:
          'Your Training Centre is yet to assign workbooks to you. Please check back soon.'
      },
      noLearners: {
        icons: ['icon-learner', 'icon-female', 'icon-male'],
        title: 'No Learners yet',
        description: 'There is no learners assigned to this centre yet.'
      },
      selectLearner: {
        icons: ['icon-learner', 'icon-female', 'icon-male'],
        title: 'Select Learner',
        button: 'Select Learner',
        description:
          'Please select your learner for this qualification to check their progress.'
      },
      default: {
        icons: ['icon-learner', 'icon-female', 'icon-male'],
        title: 'There is nothing to show.',
        description: "Looks like there isn't much content here yet."
      }
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.email) this.triggerEmail();
    else if (this.props.onButtonClick) this.props.onButtonClick();
  }

  triggerEmail() {
    window.location.href = `mailto:${this.props.email}`;
  }

  render() {
    const { title, description, type, onButtonClick, email } = this.props;

    return (
      <div className="empty-view p-t-25 p-b-25">
        <div className="empty-view-description">
          <h2 className="is-1">
            {title || this.typesData[type].title}
          </h2>
          <p>
            {description || this.typesData[type].description}
          </p>
        </div>
        <div className="empty-view-cards">
          <div className="blank-card blank-card-small">
            <div className={`icon ${this.typesData[type].icons[2]}`} />
            <div className="line-wrapper">
              <div className="line" />
              <div className="line line-short" />
            </div>
          </div>
          <div className="blank-card blank-card-medium">
            <div className={`icon ${this.typesData[type].icons[1]}`} />
            <div className="line-wrapper">
              <div className="line" />
              <div className="line line-short" />
            </div>
          </div>
          <div className="blank-card blank-card-big">
            <div className={`icon ${this.typesData[type].icons[0]}`} />
            <div className="line-wrapper">
              <div className="line" />
              <div className="line line-short" />
            </div>
            {(onButtonClick || email) &&
              <div
                className="button is-primary-color"
                onClick={this.handleClick}
              >
                {this.typesData[type].button}
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

EmptyView.defaultProps = {
  type: 'default',
  title: null,
  description: null,
  email: null,
  onButtonClick: null
};

EmptyView.propTypes = {
  email: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onButtonClick: PropTypes.func,
  type: PropTypes.oneOf([
    'qualifications',
    'workbooks',
    'noLearners',
    'selectLearner',
    'default'
  ])
};

export default EmptyView;
