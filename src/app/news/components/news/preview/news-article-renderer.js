import React, { Component } from 'react';
import {
  __,
  cond,
  contains,
  filter,
  find,
  identity,
  isEmpty,
  map,
  nth,
  of,
  pipe,
  prop,
  propEq,
  equals,
  always,
  T,
  merge,
  keys,
  and
} from 'ramda';
import redraft from 'redraft';
import cx from 'classnames';
import common from 'app/common';
import {
  correctFontColor,
  splitContentToChapters,
  animationDirection
} from 'app/workbooks/util/helpers';

import Isvg from 'react-inlinesvg';
import IconGlobe from 'images/icon_globe.svg';

import { renderers } from './renderers';

const {
  components: { CloudinaryMedia }
} = common;

// TODO: Fix CSS on `.workbook-preview-container`
const $animate = { animate: false };

const getRibbon = cond([
  [equals('submitted'), always(['#d4eae4', '#008638', 'Submitted'])],
  [equals('approved'), always(['#d2db0e', '#003057', 'Approved'])],
  [equals('rejected'), always(['#db0020', '#fff', 'Rejected'])],
  [T, always(['#d4eae4', '#008638', 'To do'])]
]);

class NewsArticleDraftContentRenderer extends Component {
  componentDidMount() {
    this.props.reloadAnimateNodes();
    this.props.joinVideoBlocks();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.currentChapterIndex !== nextProps.currentChapterIndex) {
      this.topDiv.scrollIntoView();
    }
  }

  componentDidUpdate() {
    this.props.reloadAnimateNodes();
    const { isPrinting, showActivitiesOnly } = this.props;
    if (and(isPrinting, showActivitiesOnly)) {
      window.focus();
      window.print();
    }
  }

  renderImageBlock(imageData, key) {
    return (
      <div
        key={key}
        className={cx('image-block', imageData.position)}
        style={{
          backgroundColor: imageData.color || '#F9F9F9',
          padding: imageData.color === '#ffffff' && 0
        }}
      >
        <div
          className={cx(
            'image-block-image',
            $animate,
            'fade-in',
            `move-in-${animationDirection(imageData.position)}`
          )}
        >
          <img src={imageData.image} alt="" />
        </div>
        {imageData.position !== 'block-center' && (
          <div
            className={cx(
              'image-block-text',
              $animate,
              'fade-in',
              `move-in-${animationDirection(imageData.position, true)}`
            )}
            style={{ color: correctFontColor(imageData.color) }}
          >
            <div className="image-block-title">
              {imageData.title || 'Default Title'}
            </div>
            <div className="image-block-description">
              {imageData.description || 'Default Description'}
            </div>
          </div>
        )}
      </div>
    );
  }

  renderVideoBlock(videoData, key, isPrinting) {
    let video = null;

    if (videoData.video && !isPrinting) {
      video =
        videoData.video.indexOf('http') > -1 ? (
          <iframe
            className={cx(
              'video-block-video',
              'embed',
              $animate,
              'fade-in',
              `move-in-${animationDirection(videoData.position)}`
            )}
            src={videoData.video}
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <CloudinaryMedia
            mediaType="video"
            fileId={videoData.video || ''}
            handleImageLoaded={this.props.handleImageLoaded}
            className={cx(
              'video-block-video',
              $animate,
              'fade-in',
              `move-in-${animationDirection(videoData.position)}`
            )}
            attributes={{ preload: 'none', controls: true }}
          />
        );
    } else {
      // TODO use local asset
      video = (
        <CloudinaryMedia
          mediaType="image"
          handleImageLoaded={this.props.handleImageLoaded}
          fileId="testing/xbovm0fkeyatzrov2wfe"
          className={cx(
            'video-block-video',
            $animate,
            'fade-in',
            `move-in-${animationDirection(videoData.position)}`
          )}
        />
      );
    }

    return (
      <div
        key={key}
        className={cx('video-block', videoData.position)}
        style={{ backgroundColor: videoData.color }}
      >
        {video}
        {videoData.position !== 'block-center' && (
          <div
            className={cx(
              'video-block-text',
              $animate,
              'fade-in',
              `move-in-${animationDirection(videoData.position, true)}`
            )}
            style={{ color: correctFontColor(videoData.color) }}
          >
            <div className="video-block-title">
              {videoData.title || 'Default title'}
            </div>
            <div className="video-block-description">
              {videoData.description || 'Default description'}
            </div>
          </div>
        )}
      </div>
    );
  }

  renderLinkBlock(linkData) {
    return (
      <div className={cx('link-block fade-in', $animate)}>
        <div className="globe-icon">
          <Isvg src={IconGlobe} />
        </div>
        <a
          href={
            linkData.url && linkData.url.indexOf('http') === -1
              ? `//${linkData.url}`
              : linkData.url
          }
          rel="noopener noreferrer"
          target="_blank"
        >
          {linkData.text || linkData.url}
        </a>
      </div>
    );
  }

  render() {
    const {
      className,
      textSize,
      workbook,
      showActivitiesOnly,
      getHighlightedText,
      isPrinting
    } = this.props;

    const rendererMap = {
      ...renderers,
      entities: {
        IMAGE: (children, data, { key }) =>
          children.map(() => this.renderImageBlock(data, key)),
        VIDEO: (children, data, { key }) =>
          children.map(() => this.renderVideoBlock(data, key, isPrinting)),
        LINKBLOCK: (children, data) =>
          children.map(() => this.renderLinkBlock(data, children))
      }
    };

    // Optionaly filter content type with state
    const filterContentFn = showActivitiesOnly
      ? filter(pipe(prop('type'), contains(__, ['atomic', 'ACTIVITY'])))
      : identity;

    const cleanEmptyActivities = x => {
      if (showActivitiesOnly) {
        const blocks = filter(block => {
          const key = block.entityRanges[0].key;
          const entityKeys = pipe(prop('entityMap'), keys, map(Number))(x);
          return contains(Number(key), entityKeys);
        }, x.blocks);
        return merge(x, { blocks });
      }
      return x;
    };

    const rendered = pipe(
      JSON.parse,
      map(filterContentFn),
      cleanEmptyActivities,
      x => redraft(x, rendererMap, { cleanup: false })
    )(workbook);

    const showContents = rendered;

    return (
      <div
        ref={e => {
          this.topDiv = e;
        }}
      >
        <div
          onMouseUp={getHighlightedText}
          className={cx(className, `textSize${textSize}`)}
          style={{ paddingTop: '0px' }}
        >
          {showContents}
        </div>
      </div>
    );
  }
}

export default NewsArticleDraftContentRenderer;
