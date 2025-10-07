import React from 'react';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Text, Option, _t, _tf, _tLevel } from 'app/intl';

import { HeaderView } from '../components';

import navTabs from '../config/navs';
import ActionPlanCard from '../components/action-plan/action-plan-card';

const {
  components: { EmptyView, Footer, ContentModalNew, UINavigation, UILoading },
  util: {
    helpers: { extractUserRole, extractUserCentre, elementAboveHeader }
  }
} = common;

const {
  SuperAdmin,
  SiteAdmin,
  CentreAdmin,
  CentreTutor,
  CentreLearner
} = Roles;

class ActionPlanRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {}

  renderPlans() {
    const plans = ['', '', '', ''];
    return (
      <div className="action-plans">
        {lodash.map(plans, (plan, i) => (
          <div key={`action-plan-card-${i}`}>
            <ActionPlanCard />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { setSearchQuery, lang } = this.props;

    return (
      <div className="action-plan-route min-content-height">
        <HeaderView />

        {/* Nav */}
        <section className="navigation-section">
          <div className="container">
            <UINavigation
              active={`action-plan`}
              tabs={navTabs}
              translate={false}
            />
          </div>
        </section>

        <section className="content-section p-t-30 p-b-30">
          <div className="container" />
        </section>

        <section className="content-section">
          <div
            className="container p-b-30"
            style={{ maxWidth: '1140px', margin: 'auto' }}
          >
            <div className="subtitle">Active Objectives</div>
            <div>
              <div>
                Acite objectives have been shared with one or more of your
                students and are being actively tracked
              </div>
            </div>
            {this.renderPlans()}
          </div>
        </section>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, profile, bookstand }) => {
  return {
    user: lodash.get(profile, 'user'),
    lang: persisted.lang
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ActionPlanRoute);
