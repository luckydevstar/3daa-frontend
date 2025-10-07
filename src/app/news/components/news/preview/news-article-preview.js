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
import moment from 'moment-timezone';
import inViewport from 'in-viewport';
import { routerActions } from 'react-router-redux';

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

import NewsArticleDraftContentRenderer from './news-article-renderer';
import { relative } from 'path';

const { CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin } = Roles;

const { CloudinaryMedia, ContentModalNew, UILoading } = common.components;

/**
 * Extracts the number of non link entities
 * (videos, acitivities, images) from a workbook
 * @param {Object} props
 */
const getWorkbookImageAmount = props => {
  try {
    // cachedWorkbook content takes priority over normal
    // workbook content (in the case of the editor)
    const contentJson = path(['content'], props);

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

class NewsArticlePreview extends Component {
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
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!path(['content'], this.props) && path(['content'], nextProps)) {
      this.setState({
        imgAmount: getWorkbookImageAmount(nextProps),
        imgLoadedAmount: 0
      });
    }
  }

  componentWillUnmount() {
    // Needs work
    // this.props.clearWorkbook();
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
    const { title } = this.props;
    // If the amount of loaded images === total counted images,
    // show the print modal
    if (inc(imgLoadedAmount) === imgAmount) {
      this.setState(
        {
          imgLoaded: true
        },
        () => {
          // document.title = title;
          // window.focus();
          // window.print();
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

  render() {
    const {
      content,
      textSize,
      setTextSize,
      currentLang,
      toggleLanguage
    } = this.props;
    const { onTextSizeSliderChange } = this;
    const {
      synth: { speaking },
      imgLoaded
    } = this.state;

    return (
      <div
        id="top"
        className="workbook-preview-container"
        style={{ position: 'relative', margin: 'auto' }}
      >
        <div className="workbook-preview-inner">
          <div>
            <div className="workbook-preview">
              {/* content */}

              {content ? (
                <NewsArticleDraftContentRenderer
                  {...{
                    onScroll: this.handleDocumentScroll,
                    workbook: content,
                    activities: [],
                    className: 'preview',
                    errorMessage: 'error',
                    handleImageLoaded: () => this.handleImageLoaded(),
                    controlSpeech: () => this.controlSpeech(),
                    getHighlightedText: () => this.getHighlightedText(),
                    reloadAnimateNodes: () => this.reloadAnimateNodes(),
                    joinVideoBlocks: () => this.joinVideoBlocks(),
                    textSize
                  }}
                />
              ) : (
                (() => {
                  return 'No news article content';
                })()
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ workbooks: { textSize }, persisted }) => ({
  textSize,
  currentLang: persisted.lang
});

const mapDispatchToProps = dispatch => ({
  toggleLanguage: lang => dispatch(CoreCreators.language(lang)),
  goBack: () => dispatch(routerActions.goBack()),
  setTextSize: size => dispatch(Creators.setTextSize(size)),
  toggleWorkbookOpen: open => dispatch(CoreCreators.toggleWorkbookOpen(open))
});

NewsArticlePreview.defaultProps = {
  workbook: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsArticlePreview);
