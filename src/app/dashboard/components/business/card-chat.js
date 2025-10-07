import React, { Component } from 'react';
import { IntercomAPI } from 'react-intercom';

class DashboardBusinessCardChat extends Component {
  constructor(props) {
    super(props);

    this.openIntercom = this.openIntercom.bind(this);
  }

  openIntercom() {
    IntercomAPI('showNewMessage', '');
  }

  render() {
    const { mockData } = this.props;
    return (
      <div className="dashboard-business-chat m-t-20">
        <div className="card p-25">
          <div className="logo">
            {mockData && mockData.advice_logo && (
              <img src={mockData.advice_logo} />
            )}
          </div>

          <div className="live-chat" onClick={this.openIntercom}>
            <i className="fa fa-comments p-r-10" /> Live Chat
          </div>

          <div className="desc-1 p-t-20">Chat with our dedicated team</div>

          <div className="desc-2 p-t-20">
            Please note: Live Chat is available in English only
          </div>

          <div className="m-t-30">
            <button
              className="button is-primary is-outlined is-fullwidth"
              onClick={this.openIntercom}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardBusinessCardChat;
