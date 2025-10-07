import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { equals, filter, path, prop, descend, ascend, sortWith } from 'ramda';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';

import { Creators as NewsActions } from 'app/news/actions';
import NewsArticlePreview from '../components/news/preview/news-article-preview';
import { Header, Navs, NewsCard } from '../components';

const {
  components: { CloudinaryMedia, Footer },
  util: { dateUtils }
} = common;

const helpers = common.util.helpers;
const UserAccess = helpers.UserAccess;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin,
  Member
} = Roles;

class NewsViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      centreRoles: [CentreTutor, CentreAdmin],
      adminRoles: [SiteAdmin, SuperAdmin],
      learnerRoles: [CentreLearner, Member],
      newsSlug: ''
    };
    this.gotoNewsView = this.gotoNewsView.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { news, getAllNewsAttempt, params } = this.props;

    this.setState({ newsSlug: params.newsSlug });

    if (!news) getAllNewsAttempt(null, '?offset=0&limit=100');
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { params } = nextProps;
    const { newsSlug } = this.state;

    if (newsSlug != params.newsSlug) {
      this.setState({ newsSlug: params.newsSlug });
    }
  }

  getInitData(content) {
    let response = {};
    if (content) {
      response = JSON.parse(content);
    }
    return JSON.stringify(response);
  }

  gotoNewsView(slug) {
    browserHistory.push('/news/view/' + slug);
  }

  createBothPreview(file, cloudinaryMediaType) {
    let result = null;
    if (file) {
      if (typeof file === 'string') {
        switch (cloudinaryMediaType) {
          case 'image':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                transformations={{
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          case 'video':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                thumbnail
                transformations={{
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          default:
        }
      } else {
        if (file.type.includes('video')) {
          result = (
            <video
              src={file.preview}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else if (file.type.includes('image')) {
          result = (
            <img
              src={file.preview}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else {
          result = <div />;
        }
      }
    }
    return result;
  }

  render() {
    const { newsSlug } = this.state;
    const { news } = this.props;

    const otherNewsViewNum = 3;
    let currentNews = null;
    let otherNews = [];

    if (news) {
      currentNews = news.find(i => i.slug == newsSlug);
      otherNews = sortWith([descend(prop('created')), descend(prop('viewed'))])(
        filter(e => e.news_id != currentNews.news_id, news)
      );
    }

    otherNews = otherNews.slice(0, otherNewsViewNum);

    return (
      <div className="news-view-container">
        <Header
          title={currentNews ? currentNews.title : ''}
          subTitle={
            currentNews
              ? dateUtils.formatDate(
                  new Date(currentNews.created),
                  'yyyy-MM-dd'
                )
              : ''
          }
          isView={true}
          goBack={() => {
            browserHistory.push(`/news`);
          }}
        />

        <Navs currentNews={currentNews} />
        {currentNews ? (
          <div>
            {currentNews.news_provider_header && (
              <div
                className="header-background"
                style={{
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                {this.createBothPreview(
                  currentNews.news_provider_header,
                  'image'
                )}
              </div>
            )}
            <div className="container news-view-content">
              <div className="news-article-view">
                <NewsArticlePreview
                  title={currentNews.title}
                  content={this.getInitData(currentNews.content)}
                />
              </div>
              <div className="other-news-list">
                {otherNews.map((o, i) => {
                  return (
                    <div
                      key={'other-news' + i}
                      className="other-news"
                      onClick={() => this.gotoNewsView(o.slug)}
                    >
                      <NewsCard news={o} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="has-text-centered p-t-50 p-b-50"
            style={{ width: '100%' }}
          >
            No Content
          </div>
        )}

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  news: path(['news', 'news'])(state),
  currentNews: path(['news', 'currentNews'])(state),
  attemptingGetAllNews: path(['news', 'attemptingGetAllNews'])(state),
  errorCode: path(['news', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  getAllNewsAttempt: (archived, params) =>
    dispatch(NewsActions.getAllNewsAttempt(archived, params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsViewContainer);
