import React, { Component } from 'react';
import { connect } from 'react-redux';
import { equals, path } from 'ramda';
import classNames from 'classnames';

import { Creators as WorkbooksActions } from 'app/workbooks/actions';
import { Creators as NewsActions } from 'app/news/actions';
class NewsNavs extends Component {
  constructor() {
    super();
    this.state = {
      viewTextSize: false
    };
    this.onTextSizeSliderChange = this.onTextSizeSliderChange.bind(this);
  }

  onTextSizeSliderChange(e) {
    this.props.setTextSize(parseInt(e.target.value));
  }

  render() {
    const {
      currentNews,
      textSize,
      setTextSize,
      putSaveNewsAttempt
    } = this.props;
    const { viewTextSize } = this.state;

    return (
      <div className="news-navs">
        <div className="container">
          <div className="navs">
            <div className="item">
              <i
                className={classNames('fa', {
                  'fa-heart': currentNews && currentNews.saved,
                  'fa-heart-o': !currentNews || !currentNews.saved
                })}
                onClick={() =>
                  putSaveNewsAttempt(currentNews.news_id, !currentNews.saved)
                }
              />
            </div>
            {/*<div className="item"><i className="fa fa-share-alt" /></div>*/}
            <div className="item">
              <i
                className="fa fa-font"
                onClick={() =>
                  this.setState({ viewTextSize: !this.state.viewTextSize })
                }
              />
            </div>
          </div>
        </div>

        {viewTextSize ? (
          <div className="navbar-item text-size-slider">
            <div
              className="decrement-text-size fa fa-minus"
              onClick={() => textSize > 0 && setTextSize(textSize - 1)}
            />
            <div className="range-slider">
              <input
                className="range-input"
                type="range"
                min="0"
                max="5"
                value={textSize}
                onChange={this.onTextSizeSliderChange}
              />
            </div>
            <div
              className="increment-text-size fa fa-plus"
              onClick={() => textSize < 5 && setTextSize(textSize + 1)}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentLang: path(['persisted', 'lang'])(state),
  textSize: path(['workbooks', 'textSize'])(state),
  news: path(['news', 'news'])(state),
  errorCode: path(['news', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  setTextSize: size => dispatch(WorkbooksActions.setTextSize(size)),
  putSaveNewsAttempt: (news_id, save) =>
    dispatch(NewsActions.putSaveNewsAttempt(news_id, save))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsNavs);
