import React, { Component } from 'react';

class JobsNavigation extends Component {
  render() {
    const { children } = this.props;

    return (
      <section className="jobs_navigation">
        <div className="columns is-paddingless is-marginless">
          {children}
        </div>
      </section>
    );
  }
}

export default JobsNavigation;
