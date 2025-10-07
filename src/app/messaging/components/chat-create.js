import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { map, append } from 'ramda';
import { Field, reduxForm } from 'redux-form';

import { Creators as Actions } from '../actions';
import ChatParticipant from './chat-participant';
import classnames from 'classnames';
import common from 'app/common';

const {
  components: {
    Form: { field, select, file }
  }
} = common;
const FormFile = file;
const FORM_NAME = 'chatCreate';

class ChatCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      profilePhoto: null,
      localProfilePhoto: null
    };

    this.startChat = this.startChat.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { selectedChat, layout } = this.props;
    if (selectedChat && layout === 'editing') {
      this.setState({
        title: selectedChat.title
      });
    }
  }

  startChat(value) {
    const {
      user,
      contacts,
      layout,
      startChat,
      changeChatParticipants
    } = this.props;
    const { title } = this.state;
    const file = value.profile_photo ? value.profile_photo[0] : null;

    if (layout === 'create') {
      startChat(append(user, contacts), title, file);
    } else {
      changeChatParticipants();
    }
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

  render() {
    const {
      contacts,
      remove,
      user,
      callingApi,
      layout,
      handleSubmit
    } = this.props;
    const { title, localProfilePhoto } = this.state;
    const clsname = classnames('button is-primary', {
      'is-loading': callingApi
    });

    return (
      <div className="chat-create">
        <div>
          <ChatParticipant
            key={`cp-${user.member_id}`}
            user={user}
            remove={remove}
            unremovable
          />
          {map(contact => (
            <ChatParticipant
              key={`cp-${contact.member_id}`}
              user={contact}
              remove={remove}
              unremovable={contact.unremovable}
            />
          ))(contacts)}
        </div>
        <form
          className="chat-create-form"
          onSubmit={handleSubmit(this.startChat.bind(this))}
        >
          <div className="start-chat-section">
            <h1>Select contacts to start conversation with</h1>
            <div className="m-t-20 m-b-10">
              <input
                type="text"
                className="input"
                placeholder="Chat Title"
                value={title}
                onChange={ev => {
                  this.setState({
                    title: ev.target.value
                  });
                }}
              />
            </div>
            <div className="photo is-marginless is-centered m-t-50 m-b-30">
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
            <button
              className={clsname}
              disabled={!contacts || contacts.length === 0 || !this.state.title}
              type="submit"
            >
              {layout === 'editing' ? 'Add Participants' : 'Start Chat'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({
  contacts: { selectedContacts },
  profile: { user },
  chats: { all, selectedChat, callingApi, layout }
}) => ({
  contacts: selectedContacts,
  user,
  selectedChat: all[selectedChat],
  callingApi,
  layout
});

const mapDispatchToProps = dispatch => ({
  remove: contact => dispatch(Actions.toggleContact(contact, true)),
  startChat: (participants, title, file) =>
    dispatch(Actions.startChatAttempt(participants, title, false, file)),
  gotoMessages: () => dispatch(push('/messaging')),
  changeChatParticipants: () => dispatch(Actions.chatParticipantsAttempt())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: FORM_NAME,
    validate: null
  })(ChatCreate)
);
