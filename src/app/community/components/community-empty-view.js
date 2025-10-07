import React from 'react';

import iconProfileSvg from 'images/icon_profile.svg';
import { Text } from 'app/intl';

const EmptyCards = ({ dispatch }) =>
  <div className="cards">
    <div className="card1">
      <img alt="profile" src={iconProfileSvg} />
      <div className="lines">
        <span />
        <span />
      </div>
      {/* <button
              // TODO what is New Connection?
              // onClick={() => dispatch(Creators.communityInviteModal())}
              onClick={() => null}
              className="button is-primary"
            >
              New Connection
            </button> */}
    </div>
    <div className="card2">
      <img alt="profile" src={iconProfileSvg} />
      <div className="lines">
        <span />
        <span />
      </div>
    </div>
    <div className="card3">
      <img alt="profile" src={iconProfileSvg} />
      <div className="lines">
        <span />
        <span />
      </div>
    </div>
  </div>;

const All = () =>
  <div className="text">
    <h3>
      <Text iKey="no_connections_here_yet" />
    </h3>
  </div>;

const EmptyView = ({ dispatch }) =>
  <div className="community-empty-container">
    <div className="inner">
      {<All />}
      <div className="action">
        <EmptyCards {...{ dispatch }} />
      </div>
    </div>
  </div>;

export default EmptyView;
