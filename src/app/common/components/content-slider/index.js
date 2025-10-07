/* eslint-disable react/no-find-dom-node */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';

class ContentSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heights: [],
      index: props.activeIndex || 0
    };
    this.slides = [];

    this.cacheHeights = this.cacheHeights.bind(this);
    this.goTo = this.goTo.bind(this);
    this.handleTabKey = this.handleTabKey.bind(this);
    this.findNextTabEl = this.findNextTabEl.bind(this);
    this.attachActiveSlideObserver = this.attachActiveSlideObserver.bind(this);
  }

  /**
   * On mount and unmount, bind and unbind events to handle caching the slide
   * heights and events handling the tab key, as well as attach and detach
   * the active slide resize ovserver.
   */
  componentDidMount() {
    if (this.props.manageHeight) {
      window.addEventListener('resize', this.cacheHeights);
      this.cacheHeights();
      this.attachActiveSlideObserver();
    }
    window.addEventListener('keydown', this.handleTabKey);
  }

  /**
   * Handle receival of new index.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.index !== nextProps.activeIndex) {
      this.setState({
        index: nextProps.activeIndex
      });
    }
  }

  /**
   * Handle active slide height observer on change.
   */
  componentDidUpdate(prevProps, prevState) {
    // If active slider Resize Observer exists and the previous
    // state index and the current state index don't match,
    // remove the observer
    if (this.props.manageHeight) {
      if (this.state.ro && prevState.index !== this.state.index) {
        this.detachActiveSlideObserver();
      } else if (!this.state.ro && prevState.index === this.state.index) {
        this.attachActiveSlideObserver();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.manageHeight) {
      window.removeEventListener('resize', this.cacheHeights);
      this.detachActiveSlideObserver();
    }
    window.removeEventListener('keydown', this.handleTabKey);
  }

  /**
   * Finds the next or previous element that a u
   ser can tab to
   * based on a delta (1, -1).
   */
  findNextTabEl(el, delta) {
    const universe = document.querySelectorAll(
      'input, button, select, textarea, a[href]'
    );
    const list = Array.prototype.filter.call(
      universe,
      item => item.tabIndex >= '0'
    );
    const index = list.indexOf(el);
    return list[index + delta] || list[0];
  }

  /**
   * Prevent the user from being knocked off the current
   * slide by hitting the tab key and focusing on
   * an element in a different slide.
   */
  handleTabKey(e) {
    if (e.which === 9) {
      const parent = ReactDOM.findDOMNode(this);
      const delta = e.shiftKey ? -1 : 1;
      const target = this.findNextTabEl(e.target, delta);
      if (
        parent.querySelector('.active.content-slider-slide').contains(target)
      ) {
        return true;
      }
      e.preventDefault();
      return false;
    }
  }

  /**
   * Caches the heights of all the slides for easy access.
   */
  cacheHeights() {
    const arr = [];

    // Find slider container height so we can make the slider 100% if necessary
    // const parent = ReactDOM.findDOMNode(this);
    // const containerHeight = parent.parentNode.offsetHeight;

    this.slides.forEach(slide => {
      const height = ReactDOM.findDOMNode(slide).offsetHeight;
      arr.push(height);
    });

    this.setState({
      heights: arr
    });
  }

  /**
   * Go to slide at index (index).
   */
  goTo(index) {
    this.setState({
      index
    });
  }

  /**
   * The resize observer will allow us to change the height of the main element
   * if any of its contents changes too.
   */
  attachActiveSlideObserver() {
    const parent = ReactDOM.findDOMNode(this);
    const ro = new ResizeObserver(() => this.cacheHeights());
    ro.observe(parent.querySelector('.active.content-slider-slide'));
    this.setState({
      ro
    });
  }

  detachActiveSlideObserver() {
    this.state.ro.disconnect();
    this.setState({
      ro: null
    });
  }

  render() {
    const { manageHeight, children } = this.props;

    const content = children.map((child, i) => (
      <div
        key={i}
        ref={el => {
          this.slides[i] = el;
        }}
        className={
          i === this.props.activeIndex
            ? 'active content-slider-slide'
            : 'content-slider-slide'
        }
      >
        {child}
      </div>
    ));

    return (
      <div
        className="content-slider"
        style={{
          ...(manageHeight && { height: this.state.heights[this.state.index] })
        }}
      >
        <div
          className="content-slider-inner"
          style={{
            transform: `translate3d(-${(this.props.activeIndex || 0) *
              100}%,0,0)`
          }}
        >
          {content}
        </div>
      </div>
    );
  }
}

ContentSlider.defaultProps = {
  manageHeight: true
};

ContentSlider.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  manageHeight: PropTypes.bool
};

export default ContentSlider;
