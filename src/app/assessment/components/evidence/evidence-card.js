import React, { Component } from 'react';
import common from 'app/common';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';

import { extractUserCentre } from 'app/common/util/helpers';
import IconInfo from 'images/icon-info.svg';

import EvidenceCardFront from './evidence-card-front';
import EvidenceCardBack from './evidence-card-back';

import {
  cond,
  path,
  pipe,
  map,
  filter,
  without,
  update,
  head,
  prop,
  propOr,
  nth,
  either,
  isNil,
  and,
  gte,
  gt,
  equals,
  isEmpty,
  length,
  pathOr,
  always,
  __
} from 'ramda';

const {
  components: { UIFlipper }
} = common;

class EvidenceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      memberId,
      qualificationId,
      evidence,
      opened,
      userRole,
      evidenceDetailView,
      onDetailView
    } = this.props;

    return (
      <div className="evidence-card">
        <div className="hover-capture">
          <UIFlipper
            key={`QualFlipper_${1}`}
            front={
              <EvidenceCardFront {...{ memberId, qualificationId, evidence }} />
            }
            back={<EvidenceCardBack {...{ evidence }} />}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProp = ({ profile, community, persisted }) => ({
  user: lodash.get(profile, 'user')
});

const mapDispatchToProps = dispatch => ({});

export default EvidenceCard;
