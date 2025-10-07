import React, { Component } from 'react';
import cx from 'classnames';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 0 };
  }

  componentDidMount() {
    this.props.onOpen();
  }

  render() {
    const { height, size, className: propClasses, show, close } = this.props;

    const classes = cx('modal', 'new', propClasses, `is-${size}`, {
      flex: height === 'fixed',
      block: height === 'auto',
      open: show
    });

    const elementHeader = () => {
      const { title, subtitle, description } = this.props;
      return title || subtitle || description ? (
        <div className="has-text-centered modal-header">
          {title && <h1>{title}</h1>}
          {subtitle && <h2>{subtitle}</h2>}
          {description && <p>{description}</p>}
        </div>
      ) : null;
    };

    const elementTabs = () => {
      const setTab = i => {
        this.setState({ selectedTab: i });
      };

      const { children, tabs } = this.props;
      const { selectedTab } = this.state;
      return !children.length || !tabs ? null : (
        <div className="modal-nav tabs">
          <ul>
            {children.map((el, i) => {
              if (el.props.title) {
                const modalClasses = cx({
                  'is-active': selectedTab === i
                });
                return (
                  <li
                    className={modalClasses}
                    onClick={() => setTab(i)}
                    key={i}
                  >
                    <a>{el.props.title}</a>
                  </li>
                );
              }
              throw new Error(
                'You have enabled modal tabs but supplied an element without a title prop.'
              );
            })}
          </ul>
        </div>
      );
    };

    const elementBody = () => {
      const { children, loadTabs, tabs } = this.props;
      const { selectedTab } = this.state;

      const tabContent = !loadTabs ? (
        <div className="tab-content is-active">{children[selectedTab]}</div>
      ) : (
        children.map((el, i) => {
          // TODO - add component classes
          const tabClasses = cx('tab-content', {
            'is-active': selectedTab === i
          });
          return (
            <div className={tabClasses} key={i}>
              {el}
            </div>
          );
        })
      );

      return !children.length || !tabs ? children : tabContent;
    };

    const elementFooter = () => {
      const { footerComponent } = this.props;
      return footerComponent || null;
    };

    return (
      <div className={classes}>
        <div className="modal-background fadeIn animated" onClick={close} />
        <div className="modal-content fadeInUp animated">
          <button className="modal-close" onClick={close} />
          <div className="modal-content-inner">
            {elementHeader()}
            {elementTabs()}
            <div className="modal-body">{elementBody()}</div>
          </div>
          {elementFooter()}
        </div>
      </div>
    );
  }
}

export default Modal;
