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
import ActivityModal from '../activity-modal';
import Isvg from 'react-inlinesvg';
import IconGlobe from 'images/icon_globe.svg';
import activityPrompt from 'images/activity-prompt.svg';
import { path } from 'ramda';

import { renderers } from 'app/workbooks/components/workbook-preview/renderers';

const {
  components: { CloudinaryMedia, AmazonMedia }
} = common;
const { MediaVideo } = common.components;

// TODO: Fix CSS on `.workbook-preview-container`
const $animate = { animate: false };

const getRibbon = cond([
  [equals('submitted'), always(['#d4eae4', '#008638', 'Submitted'])],
  [equals('approved'), always(['#d2db0e', '#003057', 'Approved'])],
  [equals('rejected'), always(['#db0020', '#fff', 'Rejected'])],
  [T, always(['#d4eae4', '#008638', 'To do'])]
]);

class WorkbookDraftContentRenderer extends Component {
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

  findActivity(activity_id) {
    return (
      this.props.activities &&
      find(propEq('activity_id', activity_id))(this.props.activities)
    );
  }

  findActivityData(activity_code) {
    return (
      this.props.activities &&
      find(propEq('activity_code', activity_code))(this.props.activities)
    );
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
          // <iframe
          //   className={cx(
          //     'video-block-video',
          //     'embed',
          //     $animate,
          //     'fade-in',
          //     `move-in-${animationDirection(videoData.position)}`
          //   )}
          //   src={videoData.video}
          //   frameBorder="0"
          //   allowFullScreen
          // />
          <MediaVideo
            {...{
              url: videoData.video,
              attributes: {
                className: cx(
                  'video-block-video',
                  'embed',
                  $animate,
                  'fade-in',
                  `move-in-${animationDirection(videoData.position)}`
                )
              }
            }}
          />
        ) : (
          <AmazonMedia
            mediaType="video"
            fileId={videoData.video}
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

  renderActivitySubtitle(activity_id) {
    const subtitle = [];
    const activity = this.findActivity(activity_id);
    if (activity && activity.activity_code) {
      subtitle.push(`Activity ${activity.activity_code}`);
    }

    if (
      activity &&
      activity.covers_criteria &&
      activity.covers_criteria.length > 0
    ) {
      subtitle.push(
        ` Covering outcome criteria ${activity.covers_criteria.join(', ')}`
      );
    }
    return subtitle;
  }

  renderActivityBlock(data, openActivity, key, isPrinting) {
    const activity = this.findActivityData(data.activity_code);
    const isSubmitted = path(['status'], activity) === 'submitted';
    const isApproved = path(['status'], activity) === 'approved';

    if (!activity) return null;
    const {
      badge,
      title,
      description,
      activity_id,
      activity_code,
      tout,
      tout_type,
      status
    } = activity;
    const [ribbonBackground, ribbonColor, ribbonText] = getRibbon(status);
    let Tout = (
      <img
        alt="activityPrompt"
        onLoad={this.props.handleImageLoaded}
        src={activityPrompt}
      />
    );
    // if (!isPrinting) {
    //   if (tout) {
    //     if (tout_type === 'image') {
    //       Tout = (
    //         <AmazonMedia
    //           mediaType="image"
    //           handleImageLoaded={this.props.handleImageLoaded}
    //           fileId={tout}
    //         />
    //       );
    //     } else if (tout_type === 'video') {
    //       Tout = (
    //         <AmazonMedia
    //           mediaType="video"
    //           handleImageLoaded={this.props.handleImageLoaded}
    //           fileId={tout}
    //           attributes={{ loop: true }}
    //         />
    //       );
    //     }
    //   } else {
    //     // Fallback to transparent video
    //     // TODO TransparentVideo should not be part of CloudinaryMedia
    //     Tout = (
    //       <CloudinaryMedia
    //         mediaType="video"
    //         handleImageLoaded={this.props.handleImageLoaded}
    //         fileId=""
    //         attributes={{ loop: true }}
    //         transparent
    //       />
    //     );
    //   }
    // }
    return (
      <div className="activity-block" key={key}>
        <div
          className={cx('activity-block-badge', badge || 'attempted')}
          style={{ color: ribbonColor, backgroundColor: ribbonBackground }}
        >
          {ribbonText}
        </div>
        <div
          className={cx('activity-block-text fade-in move-in-left', $animate)}
        >
          <div className="activity-block-title">{title || 'Default title'}</div>
          <div className="activity-block-subtitle">
            {this.renderActivitySubtitle(activity_id)}
          </div>
          <div className="activity-block-description">{description}</div>
          <div
            className="activity-block-button button"
            onClick={() => {
              openActivity(activity_code, activity_id);
            }}
          >
            Open Activity
          </div>
        </div>
        <div
          className={cx(
            'activity-block-image-block fade-in move-in-right',
            $animate
          )}
        >
          {Tout}
        </div>
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

  renderChapter(chapter, i) {
    if (chapter) {
      return (
        <div className="chapter-section" key={`chapter${i}`}>
          {chapter}
        </div>
      );
    }
  }

  renderActivities() {
    const { activities, learnerID } = this.props;

    return (
      <div className="workbook-activities">
        {activities.map((activity, i) => (
          <div key={i}>
            <ActivityModal {...{ activity, learnerID }} />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {
      className,
      textSize,
      openActivity,
      workbook,
      showActivitiesOnly,
      getHighlightedText,
      currentChapterIndex,
      isPrinting
    } = this.props;

    const rendererMap = {
      ...renderers,
      entities: {
        IMAGE: (children, data, { key }) =>
          children.map(() => this.renderImageBlock(data, key)),
        VIDEO: (children, data, { key }) =>
          children.map(() => this.renderVideoBlock(data, key, isPrinting)),
        ACTIVITY: (children, data, { key }) =>
          children.map(() =>
            isEmpty(data) || !data.activity_code
              ? null
              : this.renderActivityBlock(data, openActivity, key, isPrinting)
          ),
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

    const chapters = showActivitiesOnly
      ? of(rendered)
      : splitContentToChapters(rendered);

    const displayChapters = and(isPrinting, chapters)
      ? chapters.map((chapter, i) => this.renderChapter(chapter, i))
      : nth(showActivitiesOnly ? 0 : currentChapterIndex, chapters);

    const showContents = and(isPrinting, showActivitiesOnly)
      ? this.renderActivities()
      : displayChapters;

    return (
      <div
        ref={e => {
          this.topDiv = e;
        }}
      >
        <div
          onMouseUp={getHighlightedText}
          className={cx(className, `textSize${textSize}`, {
            'activities-only': showActivitiesOnly
          })}
        >
          {showContents}
        </div>
      </div>
    );
  }
}

export default WorkbookDraftContentRenderer;
