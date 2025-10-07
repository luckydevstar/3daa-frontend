import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class UIExplorerNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navClass: '',
      navTop: '80px'
    };
    this.updateLayout = this.updateLayout.bind(this);
  }

  componentDidMount() {
    document
      .querySelector('.content-container')
      .addEventListener('scroll', this.updateLayout);
    window.addEventListener('resize', this.updateLayout);
  }

  componentWillUnmount() {
    document
      .querySelector('.content-container')
      .removeEventListener('scroll', this.updateLayout);
    window.removeEventListener('resize', this.updateLayout);
  }

  // Calculate scrolltop of ui-explore-nav element
  calcElementScrolltop() {
    const headerHeight = document.querySelector('header')
      ? document.querySelector('header').offsetHeight
      : 0;
    const elNav = document.querySelector('.ui-explorer-nav')
      ? document.querySelector('.ui-explorer-nav').getBoundingClientRect()
      : 0;

    return !(elNav.top - headerHeight > 0);
  }

  // Scrolling checking
  updateLayout() {
    const { navClass } = this.state;
    const newClass = classNames({
      'fixed-explorer-nav': this.calcElementScrolltop('.ui-explorer-nav')
    });

    // Prevent whole component rerendering on scroll
    const headerHeight = document.querySelector('header')
      ? document.querySelector('header').offsetHeight
      : 0;
    if (newClass !== navClass) {
      this.setState({
        navClass: newClass,
        navTop: `${headerHeight}px`
      });
    }
  }

  render() {
    const { children, navTop } = this.props;
    const { navClass } = this.state;
    return (
      <div className="ui-explorer-nav">
        <div className={navClass} style={{ top: `${navTop}px` }}>
          {children}
        </div>
      </div>
    );
  }
}

UIExplorerNav.propTypes = {
  navTop: PropTypes.number
};

UIExplorerNav.defaultProps = {
  navTop: 80
};

export default UIExplorerNav;
