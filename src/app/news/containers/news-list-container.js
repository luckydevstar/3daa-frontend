import React from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import { equals, path } from 'ramda';
import Slugify from 'slugify';

import { Roles } from 'app/core/config/constants';
import common from 'app/common';

import { Creators as UserCreators } from 'app/user/actions';
import { Creators as NewsActions } from 'app/news/actions';

import ModalUserConfirm from '../components/modals/modal-user-confirm';
import NewsPanel from '../components/news/news-panel';

const { SuperAdmin } = Roles;
const {
  components: { ContentModal, UINavigation, Footer, UILoading },
  util: {
    helpers: { UserAccess }
  }
} = common;

class NewsListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subpage: 0,
      availableLevels: [],
      filteredResults: [],
      searchQuery: '',
      selectedItem: null
    };
    this.goBack = this.goBack.bind(this);
    this.getLinkSlug = this.getLinkSlug.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { getAllNewsAttempt, setActiveNewsProvider } = this.props;
    getAllNewsAttempt(null, '?offset=0&limit=100');
    setActiveNewsProvider(null);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let news = nextProps.news;
    if (news) {
      // this.setAvailableLevels(qualifications);
      if (news.length > 0) {
        this.setState({
          filteredResults: this.filterResults(news, this.state.searchQuery)
        });
      } else {
        this.setState({ filteredResults: [] });
      }
    }
  }

  getLinkSlug(item) {
    let paths = browserHistory.getCurrentLocation().pathname.split('/');
    let newPath = '';
    paths.forEach(p => {
      if (p) {
        newPath += '/' + p;
      }
    });
    if (item && item.news_id) return `${newPath}/${item.news_id}`;
    else return `${newPath}/add`;
  }

  getTabs() {
    return this.state.availableLevels.map((label, i) => ({
      key: `wb-nav-${i}`,
      text: label
    }));
  }

  goBack() {
    browserHistory.push(`/`);
  }

  setActiveTab(key) {
    this.setState({ subpage: +key.substr(7) });
  }

  getListContent() {
    const { news, attemptingGetAllNews, errorCode } = this.props;
    const { availableLevels, subpage, filteredResults } = this.state;

    if (filteredResults && filteredResults.length > 0 && !errorCode) {
      // if (mockList.length > 0 && !errorCode) {
      return filteredResults.map((item, index) => (
        <div className="column is-6-desktop is-12-tablet" key={index}>
          <NewsPanel
            key={`q-panel-${item.news_id}`}
            item={item}
            onEdit={() => this.onEditItem(item)}
          />
        </div>
      ));
    } else if (news && !filteredResults.length && !attemptingGetAllNews) {
      return (
        <div
          className="has-text-centered p-t-50 p-b-50"
          style={{ width: '100%' }}
        >
          No News articles match your query.
        </div>
      );
    } else if (!news || (!news.length && !attemptingGetAllNews)) {
      return (
        <div
          className="has-text-centered p-t-50 p-b-50"
          style={{ width: '100%' }}
        >
          No News Articles available.
        </div>
      );
    }
    return null;
  }

  filterResults(list, phrase) {
    phrase = phrase.trim().toLowerCase();
    let result = list.filter(item => {
      if (!phrase || phrase === '') return true;
      if (item.title.toLowerCase().indexOf(phrase) < 0) return false;
      return true;
    });
    return result;
  }

  handleSearchChange(value) {
    this.setState({
      searchQuery: value,
      filteredResults: this.filterResults(this.props.news, value)
    });
  }

  openModal() {
    this.modalUserConfirm.open();
  }

  closeModal() {
    this.modalUserConfirm.close();
    this.setState({ selectedItem: null });
  }

  handleSubmit(e) {
    const { currentNews } = this.props;
    const { selectedItem } = this.state;
    this.modalUserConfirm.close();
    if (selectedItem && currentNews != selectedItem) {
      browserHistory.push(this.getLinkSlug(this.state.selectedItem));
    } else if (!selectedItem) {
      let paths = browserHistory.getCurrentLocation().pathname.split('/');
      let newPath = '';
      paths.forEach(p => {
        if (p) {
          newPath += '/' + p;
        }
      });
      bsrowserHistory.push(`${newPath}/add`);
    }
  }

  onAddItem() {
    const { persistedSector } = this.props;
    this.setState({ selectedItem: null });
    if (persistedSector) browserHistory.push(`/news/article/add`);
  }

  onEditItem(item) {
    const { persistedSector } = this.props;
    this.setState({ selectedItem: item });

    if (persistedSector) browserHistory.push(`/news/article/${item.news_id}`);
    // setTimeout(() => {
    //   this.openModal();
    // });
  }

  render() {
    const { subpage, selectedItem } = this.state;
    const { attemptingGetAllNews, searchQuery } = this.props;
    const content = this.getListContent();
    const tabs = this.getTabs();

    return (
      <div className="news">
        <div className="workbook-sector-container min-content-height">
          {/* Header */}
          <section className="content-section hero smaller gray">
            <div className="hero-body">
              <div className="container">
                <div className="media">
                  {/* <div className="media-left">
                    <a className="back-button" onClick={() => this.goBack()} />
                  </div> */}
                  <div className="media-content">
                    <h1 className="title">
                      Search RSS feed Articles
                      {/* {this.props.sector && this.props.sector.title} */}
                    </h1>
                    <h2 className="subtitle">
                      Search for all the News Articles that have been added
                    </h2>
                  </div>

                  {attemptingGetAllNews && <UILoading isLoadingOverlay />}

                  <UserAccess allowRoles={[SuperAdmin]}>
                    <div className="hero-nav">
                      <div
                        onClick={() => this.onAddItem()}
                        className="button is-primary is-outlined"
                      >
                        +{' Add News'}
                      </div>
                    </div>
                  </UserAccess>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                tabs={tabs}
                active={`wb-nav-${subpage}`}
                change={e => {
                  this.setActiveTab(e);
                }}
                onSearch={v => this.handleSearchChange(v)}
                searchPlaceholder="Search all News Feeds"
              />
            </div>
          </section>

          {/* Content */}
          <section className="content-section">
            <div className="container">
              <div className="courses columns is-multiline">{content}</div>
            </div>
          </section>
        </div>

        <ContentModal
          ref={e => {
            this.modalUserConfirm = e;
          }}
        >
          <ModalUserConfirm
            editMode={selectedItem ? 3 : 1}
            title={selectedItem ? selectedItem.title : ''}
            closeModal={() => this.closeModal()}
            handleSubmit={e => this.handleSubmit(e)}
          />
        </ContentModal>

        <Footer />
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  news: path(['news', 'news'])(state),
  currentNews: path(['news', 'currentNews'])(state),
  attemptingGetAllNews: path(['news', 'attemptingGetAllNews'])(state),
  errorCode: path(['news', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  // setInitialValues: data => {dispatch(initialize('newsEdit', data));}
  getAllNewsAttempt: (archived, params) =>
    dispatch(NewsActions.getAllNewsAttempt(archived, params)),
  setActiveNewsProvider: params =>
    dispatch(NewsActions.setActiveNewsProvider(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsListContainer);
