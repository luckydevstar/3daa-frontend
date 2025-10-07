import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import {
  Types as CommunityTypes,
  Creators as CommunityActions
} from 'app/community/actions';
import Constants from 'app/community/enums';
import common from 'app/common';

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const { notifications } = Constants;

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDismissed: false
    };
  }

  getTimeAgoText(time) {
    return moment().fromNow(moment(time), true);
  }

  getEventTypeNiceText(eventType) {
    let niceText = null;

    switch (eventType) {
      case 'message':
        niceText = 'Message';
        break;
      case 'friend_request':
        niceText = 'Friend request';
        break;
      default:
    }
    return niceText;
  }

  getMetaContent() {
    const { getEventTypeNiceText } = this;
    const { item: { meta: { event, created } } } = this.props;
    return (
      <p className="notification-item__subtitle">
        <span className="notification-item__metatype">
          {getEventTypeNiceText(event)}
        </span>
        {' '}
        -
        {' '}
        {this.getTimeAgoText(created)}
      </p>
    );
  }

  getActionButtons() {
    const {
      item,
      acceptFriendRequest,
      declineFriendRequest,
      accept,
      decline
    } = this.props;
    return (
      <div className="notification-item__actions">
        <a
          className={classNames('button button-accept', {
            'is-loading': accept.attempt,
            'is-failure': accept.failure
          })}
          onClick={() => acceptFriendRequest(item)}
        >
          {(accept.success &&
            <span>
              Accepted <i className="fa fa-check" aria-hidden="true" />
            </span>) ||
            'Accept'}
        </a>
        <a
          className={classNames('button button-decline', {
            'is-loading': decline.attempt,
            'is-failure': decline.failure
          })}
          onClick={() => declineFriendRequest(item)}
        >
          {(decline.success &&
            <span>
              Declined <i className="fa fa-check" aria-hidden="true" />
            </span>) ||
            'Decline'}
        </a>
      </div>
    );
  }

  dismiss() {
    this.setState({
      isDismissed: true
    });
  }

  render() {
    const {
      isNew,
      item: {
        meta: { sender, event },
        body: { message, screen_name, cloudinary_file_id }
      }
    } = this.props;

    const { isDismissed } = this.state;

    const metaContent = this.getMetaContent();

    return !isDismissed
      ? <div className="notification-item" key={sender}>
          <div className="media">
            <div
              className="notification-item__avatar media-left"
              style={{
                backgroundImage: cloudinary_file_id
                  ? `url(${createCloudinaryUrl(cloudinary_file_id, 'image', {
                      width: 50,
                      height: 50,
                      crop: 'thumb',
                      gravity: 'face'
                    })})`
                  : 'inherit'
              }}
            />
            <div className="media-content">
              <p className="notification-item__title">{screen_name}</p>
              {metaContent}
              {event === 'message' && message}
              {event === 'friend_request' && this.getActionButtons()}
            </div>
          </div>
          {isNew &&
            <a className="dismiss" onClick={() => this.dismiss()}>Dismiss</a>}
        </div>
      : null;
  }
}

const mapStateToProps = ({ interactions }, ownProps) => {
  const { item: { meta: { notification_id } } } = ownProps;
  const { accept, decline } = interactions.find(
    item => item.meta.notification_id === notification_id
  );

  return {
    accept,
    decline
  };
};

const mapDispatchToProps = dispatch => {
  return {
    acceptFriendRequest: connection => {
      dispatch(CommunityActions.manageConnectionAttempt(connection, 'accept'));
    },
    declineFriendRequest: connection => {
      dispatch(CommunityActions.manageConnectionAttempt(connection, 'decline'));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationItem);
