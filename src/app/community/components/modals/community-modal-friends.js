import React, { Component } from 'react';
import Select from 'react-select';
import { Creators } from '../../actions';
import { connect } from 'react-redux';
import { equals } from 'ramda';

let timeout = null;

class ModalFriendsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      search: '',
      options: []
    };
    this.setValue = this.setValue.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.sendFriendRequests = this.sendFriendRequests.bind(this);
  }

  // Loads the searched friends into the modal
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { potentialFriends } = this.props;

    if (
      nextProps.potentialFriends &&
      !equals(potentialFriends, nextProps.potentialFriends)
    ) {
      // Loop through the retrieved users and build an options array
      const options = nextProps.potentialFriends.map(
        ({ member_id, screen_name }) => ({
          value: member_id.toString(),
          label: `${screen_name}`
        })
      );
      this.setState({
        options
      });
    }
  }

  // set selected value
  setValue(value) {
    this.setState({
      value
    });
  }

  // Update list based on input
  updateInput(search) {
    const { dispatch } = this.props;
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      dispatch(Creators.communityFriendSearchAttempt({ search }));
      this.setState({
        search
      });
    }, 500);
  }

  // Send friend requests
  sendFriendRequests(e) {
    e.preventDefault();
    const { value } = this.state;
    const { dispatch } = this.props;
    dispatch(Creators.friendRequestsAttempt(value.split(',')));
  }

  render() {
    const { potentialFriends, sendingRequest } = this.props;
    const { value, options, search } = this.state;
    const { setValue, updateInput, sendFriendRequests } = this;
    return (
      <div>
        <form>
          <div className="has-text-centered">
            <h3 className="m-b-5">Add Staff</h3>
            <p>Search with your friend’s name and send invite.</p>
          </div>
          <label className="label" htmlFor="friend-select">
            Friend Name
          </label>
          <Select
            multi
            simpleValue
            value={value}
            placeholder="Search..."
            options={options}
            onInputChange={updateInput}
            onChange={setValue}
            isLoading={search !== '' && !potentialFriends}
            className="react-select"
          />
          <div className="has-text-right">
            <button
              className={`button is-primary btn-send ${sendingRequest &&
                'is-loading'}`}
              onClick={sendFriendRequests}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ community }) => ({
  ...community
});

export default connect(mapStateToProps)(ModalFriendsContainer);
