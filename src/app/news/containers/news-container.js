import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { equals, path } from 'ramda';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import navTabs from '../config/navs';

import { Creators as NewsActions } from 'app/news/actions';

import { Header, NewsCard, NewsMainCard, NewsVideoCard } from '../components';

const {
  components: { UINavigation, Footer, UILoading }
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

class NewsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      centreRoles: [CentreTutor, CentreAdmin],
      adminRoles: [SiteAdmin, SuperAdmin],
      learnerRoles: [CentreLearner, Member],
      filteredResults: [],
      searchQuery: ''
    };

    this.getNews = this.getNews.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { activeNewsType } = this.props;
    this.getNews(activeNewsType);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { news } = nextProps;
    if (news) {
      if (news.length > 0) {
        this.setState({
          filteredResults: this.filterResults(news, this.state.searchQuery)
        });
      } else {
        this.setState({ filteredResults: [] });
      }
    }
  }

  filterResults(news, phrase) {
    phrase = phrase.trim().toLowerCase();
    let result = news.filter(item => {
      if (!phrase || phrase === '') return true;
      if (item.title.toLowerCase().indexOf(phrase) < 0) return false;
      return true;
    });
    return result;
  }

  setActiveTab(key) {
    const { setActiveNewsType } = this.props;
    this.getNews(key);
    setActiveNewsType(key);
  }

  getNews(newsType) {
    const { getAllNewsAttempt } = this.props;

    switch (newsType) {
      case 'archived':
        getAllNewsAttempt('archived', '?offset=0&limit=100');
        break;
      case 'featured':
        getAllNewsAttempt(null, '?offset=0&limit=100');
        break;
      default:
        getAllNewsAttempt(null, '?' + newsType + '=1' + '&offset=0&limit=100');
    }
  }

  handleSearchChange(value) {
    this.setState({
      searchQuery: value,
      filteredResults: this.filterResults(this.props.news, value)
    });
  }

  render() {
    const { routes, activeNewsType, attemptingGetAllNews } = this.props;
    const { filteredResults } = this.state;

    return (
      <div className="news-container">
        <Header
          goBack={browserHistory.goBack}
          title={'News'}
          subTitle={'saturate the mind'}
          isView={false}
        />
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active={activeNewsType}
              tabs={navTabs}
              change={e => {
                this.setActiveTab(e);
              }}
              onSearch={value => this.handleSearchChange(value)}
              searchPlaceholder="Search News"
            />
          </div>
        </section>
        <section className="content-section p-t-20 p-b-20">
          <div className="container">
            <div className="columns is-multiline is-mobile">
              {attemptingGetAllNews && <UILoading isLoadingOverlay />}
              {filteredResults.map((item, index) => {
                return index == 0 ? (
                  <div
                    key={index}
                    className="column is-9-desktop is-12-tablet border-bottom"
                  >
                    <Link to={'/news/view/' + item.slug}>
                      <NewsMainCard news={item} />
                    </Link>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="column is-3-desktop is-4-tablet border-bottom"
                  >
                    <Link to={'/news/view/' + item.slug}>
                      <NewsCard news={item} />
                    </Link>
                  </div>
                );
              })}

              {filteredResults.length == 0 && (
                <div
                  className="has-text-centered p-t-50 p-b-50"
                  style={{ width: '100%' }}
                >
                  No News articles match your query.
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  activeNewsType: path(['news', 'activeNewsType'])(state),
  news: path(['news', 'news'])(state),
  currentNews: path(['news', 'currentNews'])(state),
  attemptingGetAllNews: path(['news', 'attemptingGetAllNews'])(state),
  errorCode: path(['news', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  getAllNewsAttempt: (archived, params) =>
    dispatch(NewsActions.getAllNewsAttempt(archived, params)),
  setActiveNewsType: activeNewsType =>
    dispatch(NewsActions.setActiveNewsType(activeNewsType))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsContainer);

// <div className="column is-3-desktop is-4-tablet">
//                 <NewsVideoCard />
//               </div>
