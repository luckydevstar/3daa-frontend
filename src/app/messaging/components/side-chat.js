import React, { Component } from 'react';
import { connect } from 'react-redux';
import { append } from 'ramda';
import classnames from 'classnames';
import { Field, reduxForm } from 'redux-form';

import SidebarFeatures from 'app/core/constants';

import MessagingHeader from './messaging-header';
import ChatSideContacts from './chat-side-contacts';
import ChatSideRooms from './chat-side-rooms';
import ChatSideRoom from './chat-side-room';
import ContactsFilter from './contacts-filter';
import { Creators as Actions } from '../actions';
import NewChatButton from './new-chat-button';
import common from 'app/common';

const {
  components: {
    Form: { field, select, file }
  }
} = common;
const FormFile = file;
const FORM_NAME = 'sideChat';

class SideChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'participants',
      participant: null,
      chatTitle: '',
      profilePhoto: null,
      localProfilePhoto: null
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onSelectParticipant = this.onSelectParticipant.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { attemptGetChats, chats } = this.props;
    if (Object.keys(chats).length === 0) attemptGetChats();
  }

  onTabChange(tab) {
    this.setState({ tab });
  }

  onSelectParticipant(participant) {
    this.setState({
      tab: 'chats',
      participant
    });
  }

  onNewChat() {
    this.props.updateCreatingChat(true);
  }

  onBack() {
    this.props.updateCreatingChat(false);
  }

  startChat(value) {
    const { user, contacts, startChat } = this.props;
    const { chatTitle } = this.state;
    const file = value.profile_photo ? value.profile_photo[0] : null;

    startChat(append(user, contacts), chatTitle, file);
  }

  handlePhoto(files) {
    const file = files[0];

    if (!file.type || !file.type.match('image.*')) {
      alert('You did not upload an image.');
      return;
    }

    this.setState({
      profilePhoto: null,
      localProfilePhoto: `${window.URL.createObjectURL(file)}`
    });
  }

  renderNewChat() {
    const { tab, chatTitle, localProfilePhoto } = this.state;
    const {
      contacts,
      user,
      callingApi,
      handleSubmit,
      creatingChat
    } = this.props;
    const clsname = classnames('button is-primary', {
      'is-loading': callingApi
    });

    if (tab === 'participants') {
      return !creatingChat ? (
        <div className="new-chat-btn">
          <NewChatButton handler={this.onNewChat.bind(this)} />
        </div>
      ) : (
        <div className="new-chat">
          <div className="new-chat-header">
            <button className="backarrow" onClick={this.onBack.bind(this)} />
            <div className="new-chat-title-container">
              <input
                type="text"
                className="input"
                placeholder="Chat Title"
                onChange={ev => {
                  this.setState({ chatTitle: ev.target.value });
                }}
                value={chatTitle}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit(this.startChat.bind(this))}>
            <div className="photo">
              {localProfilePhoto ? (
                <div className="media-left">
                  <figure>
                    <div
                      className="image is-round"
                      style={{
                        backgroundImage: `url(${localProfilePhoto})`
                      }}
                    />
                  </figure>
                </div>
              ) : (
                <div className="upload-avatar hoverable image" />
              )}
              <div className="fileUploader">
                <label
                  className="fileUploader__body fileUploader--labelOnly button is-primary is-outlined"
                  htmlFor="profile_photo"
                >
                  Upload Image
                  <Field
                    className="fileUploader__file"
                    name="profile_photo"
                    type="file"
                    onChange={({ target: { files } }) =>
                      this.handlePhoto(files)
                    }
                    component={FormFile}
                  />
                </label>
              </div>
            </div>
            <div className="start-chat-btn-container">
              <button
                className={clsname}
                disabled={!contacts || contacts.length === 0 || !chatTitle}
                type="submit"
              >
                Create Chat
              </button>
            </div>
          </form>
          <ContactsFilter multiSelect />
        </div>
      );
    } else return null;
  }

  render() {
    const { sidebarOpen, sidebarFeature, selectedChat } = this.props;
    const { tab, participant } = this.state;

    return sidebarOpen && sidebarFeature === SidebarFeatures.MESSAGING ? (
      <div className="sidechat">
        {this.renderNewChat()}

        {tab === 'participants' && (
          <ChatSideContacts onSelectParticipant={this.onSelectParticipant} />
        )}

        {tab === 'chats' && (
          <ChatSideRooms
            participant={participant}
            onTabChange={this.onTabChange}
          />
        )}

        {tab === 'room' && <ChatSideRoom onTabChange={this.onTabChange} />}

        {tab === 'contacts' && <ContactsFilter multiSelect />}
      </div>
    ) : null;
  }
}

const mapStateToProps = ({
  ui,
  chats,
  contacts: { selectedContacts },
  profile: { user }
}) => ({
  chats: chats.all,
  sidebarOpen: ui.sidebarOpen,
  sidebarFeature: ui.sidebarFeature,
  callingApi: chats.callingApi,
  contacts: selectedContacts,
  user,
  creatingChat: chats.creatingChat
});

const mapDispatchToProps = dispatch => ({
  attemptGetChats: () => dispatch(Actions.getChatsAttempt()),
  startChat: (participants, title, file) =>
    dispatch(Actions.startChatAttempt(participants, title, false, file)),
  updateCreatingChat: creatingChat =>
    dispatch(Actions.updateCreatingChat(creatingChat))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: FORM_NAME,
    validate: null
  })(SideChat)
);
