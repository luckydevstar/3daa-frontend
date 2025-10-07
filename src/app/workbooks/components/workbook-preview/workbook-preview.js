import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  head,
  path,
  pathOr,
  either,
  filter,
  isEmpty,
  equals,
  and,
  trim,
  length,
  not,
  last,
  inc
} from 'ramda';
import * as lodash from 'lodash';
import moment from 'moment-timezone';
import inViewport from 'in-viewport';
import { routerActions } from 'react-router-redux';
import WorkbookRenderer from './workbook-renderer';
import ActivityModal from '../activity-modal';
import { Creators } from 'app/workbooks/actions';
import { Creators as CoreCreators } from 'app/core/actions';
import common from 'app/common';
import cx from 'classnames';
import { Roles } from 'app/core/config/constants';
import { UserAccess } from 'app/common/util/helpers';
import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown';
import NativeListener from 'react-native-listener';
import Toggle from 'react-toggle';
import LangMenu from 'app/core/components/header/lang-menu';
import { Text } from 'app/intl';

const {
  CentreAdmin,
  CentreTutor,
  SuperAdmin,
  SiteAdmin,
  CentreEQA,
  CentreIQA
} = Roles;

const {
  ProgressBadge,
  CloudinaryMedia,
  ContentModalNew,
  UILoading
} = common.components;

/**
 * Generates an array of objects with basic chapter
 * information from a workbook content object:
 * [{ title: <String>, content: <String> }]
 * @param {Object} props
 */
const getChapterMapFromProps = props => {
  try {
    // cachedWorkbook content takes priority over normal
    // workbook content (in the case of the editor)
    const contentJson =
      path(['cachedWorkbook', 'content'], props) ||
      path(['workbook', 'content'], props);

    const content = JSON.parse(contentJson);

    return content.blocks.reduce((acc, block) => {
      const entityRef = head(block.entityRanges);
      const chapter = last(acc);
      // Push new chapter
      if (block.type === 'header-one' && block.text) {
        acc.push({
          title: block.text,
          textContent: `${block.text}\n`
        });
        return acc;
      }
      // Only proceed if there's a valid chapter
      if (!chapter) {
        return acc;
      }
      // If block type is atomic update the chapter
      // using the relevant entity title and description
      if (block.type === 'atomic' && entityRef) {
        const { data } = content.entityMap[entityRef.key];
        chapter.textContent += `${data.title}\n${data.description}\n`;
      } else if (block.text) {
        chapter.textContent += `${block.text}\n`;
      }
      return acc;
    }, []);
  } catch (e) {
    return [];
  }
};

/**
 * Extracts the number of non link entities
 * (videos, acitivities, images) from a workbook
 * @param {Object} props
 */
const getWorkbookImageAmount = props => {
  try {
    // cachedWorkbook content takes priority over normal
    // workbook content (in the case of the editor)
    const contentJson =
      path(['cachedWorkbook', 'content'], props) ||
      path(['workbook', 'content'], props);

    const content = JSON.parse(contentJson);
    const entityKeys = Object.keys(content.entityMap);

    let count = 0;

    // Count how many non link entities (videos, acitivities, images)
    // there are in the workbook
    entityKeys.forEach(key => {
      const type = content.entityMap[key].type;
      const data = content.entityMap[key].data;
      // Verify that entity needs to be counted as part of
      // imgAmount
      if (
        type === 'LINKBLOCK' ||
        (type === 'VIDEO' && data.video === null) ||
        (type === 'IMAGE' && data.image === null)
      ) {
        return;
      }
      count++;
    });

    return count;
  } catch (e) {
    return 0;
  }
};

class WorkbookPreview extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      synth: window.speechSynthesis,
      selectedString: '',
      showActivitiesOnly: false,
      isPrinting: false,
      learnerID: pathOr(null, ['params', 'learnerId'], props),
      // IMPORTANT - a workbook can be passed into the component two ways, via the props
      // on mount or via an API call, where the data is intercepted in componentWillReceiveProps
      chapterMap: getChapterMapFromProps(props),
      imgAmount: getWorkbookImageAmount(props),
      imgLoadedAmount: 0,
      imgLoaded: false
    };

    this.animateNodes = null;
    this.transparentVideoNodes = null;
    this.scrollHelper = 1;
    this.closePreview = this.closePreview.bind(this);
    this.speak = this.speak.bind(this);
    this.controlSpeech = this.controlSpeech.bind(this);
    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.onTextSizeSliderChange = this.onTextSizeSliderChange.bind(this);
    this.onShowActivitiesOnlyToggle = this.onShowActivitiesOnlyToggle.bind(
      this
    );
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.openActivity = this.openActivity.bind(this);
  }

  componentDidMount() {
    const {
      gettingWorkbook,
      getWorkbook,
      workbook,
      params,
      changeChapterIndex,
      activeLearnerId
    } = this.props;
    if (
      !gettingWorkbook &&
      params.unitId &&
      params.workbookId &&
      (isEmpty(workbook) || Number(params.workbookId !== workbook.workbook_id))
    ) {
      getWorkbook(
        activeLearnerId || this.state.learnerID,
        Number(params.unitId),
        Number(params.workbookId)
      );
    }
    changeChapterIndex(0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !path(['workbook', 'content'], this.props) &&
      path(['workbook', 'content'], nextProps)
    ) {
      this.setState({
        chapterMap: getChapterMapFromProps(nextProps),
        imgAmount: getWorkbookImageAmount(nextProps),
        imgLoadedAmount: 0
      });
    }
  }
  // componentDidUpdate() {
  //   // console.log('All contents are updated!');
  //   // const { isPrinting } = this.state;
  //   // if (isPrinting) {
  //   //   this.printWorkbook();
  //   // }
  // }

  // componentWillUnmount() {
  //   // Needs work
  //   // this.props.clearWorkbook();
  // }

  onChapterClick(chapterIndex) {
    this.props.changeChapterIndex(chapterIndex);
    this.controlSpeech();
  }

  onNextChapterClick() {
    const { currentChapterIndex } = this.props;
    this.props.changeChapterIndex(currentChapterIndex + 1);
    this.controlSpeech();
  }

  onPrevChapterClick() {
    const { currentChapterIndex } = this.props;
    this.props.changeChapterIndex(currentChapterIndex - 1);
    this.controlSpeech();
  }

  onShowActivitiesOnlyToggle() {
    this.controlSpeech();
    this.setState({
      showActivitiesOnly: !this.state.showActivitiesOnly
    });
  }

  onTextSizeSliderChange(e) {
    this.props.setTextSize(parseInt(e.target.value));
  }

  getHighlightedText() {
    const { isPrinting } = this.state;
    if (isPrinting) return;
    const selectedString = trim(window.getSelection().toString());
    if (and(window.getSelection, selectedString !== '')) {
      this.setState({ selectedString });
      setTimeout(() => {
        this.speak(true);
      }, 0);
    }
  }

  setIsPrintingState() {
    const { isPrinting, showActivitiesOnly } = this.state;
    if (not(showActivitiesOnly)) {
      this.setState({
        isPrinting: !isPrinting,
        // next state will be !isPrinting...
        ...(isPrinting && {
          imgLoaded: false,
          imgLoadedAmount: 0
        })
      });
    } else {
      this.setState({
        isPrinting: !isPrinting
      });
    }
  }

  isNextElementVideoBlock(element) {
    let result = false;
    const nextElement =
      element && element.nextSibling && element.nextSibling.nextSibling;

    if (
      (nextElement && nextElement.className.indexOf('video-block') > -1) ||
      (nextElement &&
        nextElement.nextSibling &&
        nextElement.nextSibling.className.indexOf('video-block') > -1)
    ) {
      result = true;
    }

    return result;
  }

  removeNextElement(element) {
    let result = false;
    const nextElement = element && element.nextSibling;
    // if (nextElement && nextElement.parentNode.removeChild(nextElement)) {
    if (nextElement && nextElement.parentNode) {
      nextElement.style.display = 'none';
      result = true;
    }

    return result;
  }

  joinVideoBlocks() {
    const videoBlocks = document.querySelectorAll('.video-block');
    videoBlocks.forEach(element => {
      if (this.isNextElementVideoBlock(element)) {
        this.removeNextElement(element);
      }
    });
  }

  shouldCheckForAnimation(position, force) {
    let result = false;
    if (force) return true;
    if (position >= this.scrollHelper * 50) {
      this.scrollHelper++;
      result = true;
    }

    return result;
  }

  animationHandling() {
    if (this.animateNodes) {
      this.animateNodes.forEach(item => {
        if (!item.classList.contains('init')) {
          inViewport(item, { offset: -100 }, element => {
            element.classList.add('init');
          });
        }
      });
    }
  }

  transparentVideoPlaybackHandling() {
    if (this.transparentVideoNodes) {
      this.transparentVideoNodes.forEach(item => {
        const canvas = item.nextSibling.nextSibling;
        if (inViewport(canvas)) {
          if (item.paused) {
            item.play();
          }
        } else if (!item.paused) {
          item.pause();
        }
      });
    }
  }

  handleDocumentScroll(element) {
    if (this.shouldCheckForAnimation(element.target.scrollTop)) {
      this.animationHandling();
    }
    this.transparentVideoPlaybackHandling();
  }

  controlSpeech() {
    const { synth } = this.state;
    if (synth.speaking) {
      synth.cancel();
      this.setState({ synth, selectedString: '' });
    }
  }

  reloadAnimateNodes() {
    const container = document.getElementById('top');
    this.animateNodes = container.querySelectorAll('.animate');
    this.transparentVideoNodes = container.querySelectorAll(
      '.transparent-video'
    );
    this.scrollHelper =
      container.scrollTop <= 50 ? 1 : Math.floor(container.scrollTop / 50);
    this.animationHandling();
  }

  handleImageLoaded() {
    const { imgAmount, imgLoadedAmount } = this.state;
    const { workbook } = this.props;
    // If the amount of loaded images === total counted images,
    // show the print modal
    if (inc(imgLoadedAmount) === imgAmount) {
      this.setState(
        {
          imgLoaded: true
        },
        () => {
          document.title = workbook.title;
          window.focus();
          window.print();
        }
      );
    }
    // Update image loaded count
    this.setState({
      imgLoadedAmount: inc(imgLoadedAmount)
    });
  }

  speak(highlight) {
    const { synth, selectedString, chapterMap } = this.state;
    const { currentChapterIndex } = this.props;
    let text;
    // Already speaking and not highlighted - stop speech
    if (synth.speaking && !highlight) {
      synth.cancel();
      this.setState({ synth, selectedString: '' });
      return;
    }
    // Assign correct text based on user action
    if (highlight) {
      text = selectedString;
    } else {
      text = chapterMap[currentChapterIndex].textContent;
    }
    // Execute speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = head(synth.getVoices());
    utter.onend = () => this.setState({ synth });
    synth.speak(utter);
    this.setState({ synth, selectedString: '' });
  }

  closePreview() {
    this.props.toggleWorkbookOpen(false);
    this.state.synth.cancel();
    this.props.goBack();
  }

  renderUnitTasks() {
    const {
      workbook: { activities }
    } = this.props;
    const filterFunc = activity =>
      either(equals('submitted'), equals('approved'))(activity.status);
    if (activities && activities.length) {
      return `${filter(filterFunc, activities).length}/${activities.length}`;
    }
    return null;
  }

  openActivity(activity_code, activity_id) {
    const { activeLearnerId } = this.props;
    const {
      workbook,
      getWorkbookActivityAttempt,
      getWorkbookActivityMember
    } = this.props;
    getWorkbookActivityAttempt(
      workbook.unit_id,
      workbook.workbook_id,
      activity_code,
      activity_id,
      activeLearnerId
    );
    // getWorkbookActivityMember(activeLearnerId, activity_id);
    this.modal.open();
  }
  render() {
    const {
      workbook,
      selectedWorkbooks,
      cachedWorkbook,
      gettingWorkbook,
      textSize,
      setTextSize,
      changeChapterIndex,
      currentChapterIndex,
      activity,
      getWorkbookActivityAttempt,
      resetWorkbookActivity,
      currentLang,
      toggleLanguage,
      currentQualification,
      memberQualifications,
      user,
      params,
      activeLearnerId,
      getWorkbookActivityMember,
      router
    } = this.props;
    const { onShowActivitiesOnlyToggle, onTextSizeSliderChange } = this;
    const {
      showActivitiesOnly,
      synth: { speaking },
      chapterMap,
      isPrinting,
      imgLoaded
    } = this.state;

    const units = lodash.get(currentQualification, ['units']) || [];
    const unit = lodash.find(units, u => u.unit_id == params.unitId);

    const prevDisabled = currentChapterIndex === 0;
    const nextDisabled = currentChapterIndex === chapterMap.length - 1;
    const chaptersLength = length(chapterMap) || '';

    const cqid = lodash.get(user, 'current_qualification.qualification_id');
    const current_qualification = lodash.find(
      memberQualifications,
      q => q.qualification_id == cqid
    );
    const workbooks = lodash.get(current_qualification, 'workbooks');
    const current_workbook = lodash.find(
      workbooks,
      w => w.workbook_id == workbook.workbook_id
    );

    const isMandatory =
      lodash.get(unit, 'is_mandatory') ||
      lodash.get(current_workbook, 'mandatory');
    const isSelected =
      lodash.get(unit, 'workbook_selected') == workbook.workbook_id;

    return (
      <div id="top" className="workbook-preview-container">
        <div className="click-catcher" onClick={this.closePreview} />
        <div className="workbook-preview-inner">
          {/* Activity modal */}

          <ContentModalNew
            type="block"
            size="larger"
            ref={e => {
              this.modal = e;
            }}
            onClose={resetWorkbookActivity}
            className="workbook-activity-modal-container"
          >
            <ActivityModal
              {...{
                activity,
                learnerID: this.state.learnerID,
                onClose: () => {
                  this.modal.close();
                  resetWorkbookActivity();
                }
              }}
            />
          </ContentModalNew>

          {/* Workbook navigation */}

          <div className="workbook-preview-hud">
            <div className="inner">
              <div className="logo">
                <a href="/" className="logo-image">
                  Logo
                </a>
              </div>
              <div className="item-navigation">
                {/* <div className="switch-lang-navigation">
                  <LangMenu
                    {...{
                      currentLang,
                      toggleLanguage
                    }}
                  />
                </div> */}
                <div className="navigation">
                  {not(isPrinting) ? (
                    <UserAccess
                      allowRoles={[
                        CentreAdmin,
                        CentreTutor,
                        SuperAdmin,
                        SiteAdmin,
                        CentreIQA,
                        CentreEQA
                      ]}
                    >
                      <div className="navbar-item activities-toggle">
                        <Text iKey="activities_only" />
                        <Toggle
                          defaultChecked={showActivitiesOnly}
                          icons={false}
                          onChange={onShowActivitiesOnlyToggle}
                        />
                      </div>
                    </UserAccess>
                  ) : null}
                  {'speechSynthesis' in window && not(isPrinting) ? (
                    <a
                      className={cx('navbar-item', 'speech', {
                        speaking,
                        'is-disabled': showActivitiesOnly
                      })}
                      onClick={() => this.speak(false)}
                    >
                      Speech
                    </a>
                  ) : null}
                  {not(isPrinting) ? (
                    <div className="navbar-item text-size-slider">
                      <div
                        className="decrement-text-size fa fa-minus"
                        onClick={() =>
                          textSize > 0 && setTextSize(textSize - 1)
                        }
                      />
                      <div className="range-slider">
                        <input
                          className="range-input"
                          type="range"
                          min="0"
                          max="5"
                          value={textSize}
                          onChange={onTextSizeSliderChange}
                        />
                      </div>
                      <div
                        className="increment-text-size fa fa-plus"
                        onClick={() =>
                          textSize < 5 && setTextSize(textSize + 1)
                        }
                      />
                    </div>
                  ) : null}
                  <UserAccess allowRoles={[SuperAdmin]}>
                    <a
                      className={cx('navbar-item', 'print-big', {
                        printing: isPrinting
                      })}
                      onClick={() => this.setIsPrintingState()}
                    >
                      Print
                    </a>
                  </UserAccess>
                  <a className="navbar-item cancel" onClick={this.closePreview}>
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Workbook header */}

          <div id="printContents" className="workbook-preview-scroll">
            <div className="workbook-preview">
              {/*and(and(isPrinting, !imgLoaded), not(showActivitiesOnly)) ? (
                <UILoading isLoadingOverlay alignMiddle />
              ) : null*/}
              <div className="workbook-preview-header">
                {!!isSelected && (
                  <div className="book-item-ribbon">
                    <Text iKey="selected" />
                  </div>
                )}
                {!!isMandatory && (
                  <div className="book-item-ribbon">
                    <Text iKey="mandatory" />
                  </div>
                )}
                {workbook && workbook.header && (
                  <CloudinaryMedia
                    mediaType={workbook.header_type || 'video'}
                    fileId={workbook.header}
                    transformations={
                      workbook.header_type === 'image'
                        ? {
                            crop: 'fill',
                            gravity: 'center',
                            width: 1440,
                            height: 420
                          }
                        : {}
                    }
                    attributes={
                      workbook.header_type === 'video'
                        ? { autoPlay: true, loop: true }
                        : {}
                    }
                  />
                )}
                <div className="workbook-preview-header-content">
                  <div className="workbook-preview-header-title">
                    {workbook && workbook.title}
                  </div>
                  <div className="workbook-preview-header-cvalue">
                    <Text iKey="credit_value" />:{' '}
                    {(workbook && workbook.credit_value) || 0}
                  </div>
                  <div className="workbook-preview-header-tasks">
                    <Text iKey="unit_tasks" />: {this.renderUnitTasks()}
                  </div>
                </div>
                <div className="workbook-preview-header-curve" />
              </div>
              <div className="workbook-preview-header-bottom">
                <div className="progress-badge">
                  <ProgressBadge
                    dimensions={120}
                    strokeWidth={10}
                    percentage={workbook.progress_percentage || 0}
                    innerMargin={-1}
                    percentageFontSize={50}
                  />
                </div>
                <div className="workbook-preview-header-creation-data">
                  {workbook && workbook.created_by && workbook.created && (
                    <div className="workbook-preview-header-created">
                      Created by: {workbook.created_by.screen_name}{' '}
                      {moment(workbook.created)
                        .tz('Europe/London')
                        .format('DD/MM/YYYY')}
                    </div>
                  )}
                  {workbook && workbook.modified_by && workbook.created && (
                    <div className="workbook-preview-header-verified">
                      Reviewed by: {workbook.modified_by.screen_name}{' '}
                      {moment(workbook.modified)
                        .tz('Europe/London')
                        .format('DD/MM/YYYY')}
                    </div>
                  )}
                </div>
              </div>

              {/* Workbook content */}

              {(workbook && workbook.content) ||
              (cachedWorkbook && cachedWorkbook.content) ? (
                <WorkbookRenderer
                  {...{
                    onScroll: this.handleDocumentScroll,
                    workbook:
                      (cachedWorkbook && cachedWorkbook.content) ||
                      workbook.content,
                    activities:
                      (cachedWorkbook && cachedWorkbook.activities) ||
                      workbook.activities,
                    className: 'preview',
                    errorMessage: 'error',
                    showActivitiesOnly,
                    currentChapterIndex,
                    changeChapterIndex,
                    isPrinting,
                    learnerID: this.state.learnerID,
                    handleImageLoaded: () => this.handleImageLoaded(),
                    controlSpeech: () => this.controlSpeech(),
                    getHighlightedText: () => this.getHighlightedText(),
                    reloadAnimateNodes: () => this.reloadAnimateNodes(),
                    joinVideoBlocks: () => this.joinVideoBlocks(),
                    openActivity: this.openActivity,
                    textSize
                  }}
                />
              ) : (
                (() => {
                  if (gettingWorkbook) {
                    return <UILoading marginTop="200px" />;
                  }
                  return 'No workbook content';
                })()
              )}
            </div>
          </div>

          {/* Footer */}
          {not(isPrinting) ? (
            <footer>
              <nav className="navbar bottom-nav">
                <Dropdown className="navbar-item chapters">
                  <DropdownTrigger />
                  <DropdownContent>
                    <div className="workbook-content-menu inner">
                      {chapterMap.map(({ title }, i) => (
                        <NativeListener
                          onClick={() => this.onChapterClick(i)}
                          key={i}
                        >
                          <div className="entry media">
                            <div className="media-left">Chapter {i + 1}</div>
                            <div className="media-content">
                              <div className="name">{title}</div>
                            </div>
                            <div className="media-right align-right">
                              <div className="arrow" />
                            </div>
                          </div>
                        </NativeListener>
                      ))}
                    </div>
                  </DropdownContent>
                </Dropdown>
                {chaptersLength > 0 && (
                  <div className="navbar-end footer-page-nav">
                    <div
                      className={`navbar-item workbook-page-nav ${
                        prevDisabled ? 'is-disabled' : ''
                      }`}
                      onClick={() => !prevDisabled && this.onPrevChapterClick()}
                    >
                      <span className="previous">
                        <Text iKey="previous" />
                      </span>
                    </div>
                    <div className="navbar-item page-count">
                      <span>
                        {this.props.currentChapterIndex + 1}/{chaptersLength}
                      </span>
                    </div>
                    <div
                      className={`navbar-item workbook-page-nav ${
                        nextDisabled ? 'is-disabled' : ''
                      }`}
                      onClick={() => !nextDisabled && this.onNextChapterClick()}
                    >
                      <span className="next">
                        <Text iKey="next" />
                      </span>
                    </div>
                  </div>
                )}
              </nav>
            </footer>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  workbooks: {
    workbook,
    textSize,
    gettingWorkbook,
    activity,
    activities,
    currentChapterIndex,
    activeLearnerId
  },
  qualifications: {
    cachedWorkbook,
    currentQualification,
    memberQualifications
  },
  persisted,
  profile: { user }
}) => ({
  gettingWorkbook,
  workbook,
  textSize,
  activity,
  activities,
  cachedWorkbook,
  currentChapterIndex,
  currentLang: persisted.lang,
  currentQualification,
  memberQualifications,
  user,
  activeLearnerId
});

const mapDispatchToProps = dispatch => ({
  resetWorkbookActivity: () => dispatch(Creators.resetWorkbookActivity()),
  clearWorkbook: () => dispatch(Creators.clearWorkbook()),
  toggleLanguage: lang => dispatch(CoreCreators.language(lang)),
  getWorkbook: (member_id, unit_id, workbook_id) =>
    dispatch(
      Creators.getWorkbookMemberAttempt(member_id, unit_id, workbook_id)
    ),
  getWorkbookActivityAttempt: (
    unit_id,
    workbook_id,
    activity_code,
    activity_id,
    member_id
  ) =>
    dispatch(
      Creators.getWorkbookActivityAttempt(
        unit_id,
        workbook_id,
        activity_code,
        activity_id,
        member_id
      )
    ),
  goBack: () => dispatch(routerActions.goBack()),
  setTextSize: size => dispatch(Creators.setTextSize(size)),
  changeChapterIndex: chapterIndex =>
    dispatch(Creators.changeChapterIndex(chapterIndex)),
  toggleWorkbookOpen: open => dispatch(CoreCreators.toggleWorkbookOpen(open)),
  getWorkbookActivityMember: (member_id, activity_id) =>
    dispatch(Creators.getWorkbookActivityMemberAttempt(member_id, activity_id))
});

WorkbookPreview.defaultProps = {
  workbook: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkbookPreview);
