import React from 'react';
import { connect } from 'react-redux';
import common from 'app/common';
import config from 'brand/config';
import * as lodash from 'lodash';
import { path } from 'ramda';

import { getCartDetails } from '../../store/utils';
import { Creators as StoreActions } from '../../store/actions';
import mockData from '../config/mock';

import {
  DashboardBusinessHeader,
  DashboardBusinessCardAlert,
  DashboardBusinessCardAwards,
  DashboardBusinessCardUsers,
  DashboardBusinessNews,
  DashboardBusinessCardStore,
  DashboardBusinessCardChat,
  DashboardBusinessNewsView
} from '../components';

const {
  util: {
    helpers: { extractUserCentre }
  }
} = common;
const { ContentModal } = common.components;

class DashboardBusiness extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerClass: '',
      bannerPadding: 0,
      mockData: mockData[config.title],
      selectedNews: [],
      currentCount: 3
    };

    this.updateLayout = this.updateLayout.bind(this);
    this.openNewsViewModal = this.openNewsViewModal.bind(this);
    this.closeNewsViewModal = this.closeNewsViewModal.bind(this);
    this.newsLoadMore = this.newsLoadMore.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount() {
    const { getAllQualificationsInStoreAttempt } = this.props;
    // for Mock data, It must be removed or changed
    // this.props.addToCart();
    ///////////////////////////////////////////////
    getAllQualificationsInStoreAttempt(null);
    document
      .querySelector('.content-container')
      .addEventListener('scroll', this.updateLayout);
    window.addEventListener('resize', this.updateLayout);
  }

  componentWillUnmount() {
    document
      .querySelector('.content-container')
      .removeEventListener('scroll', this.updateLayout);
    window.removeEventListener('resize', this.updateLayout);
  }

  updateLayout() {
    const { bannerPadding } = this.state;

    const hh = document.querySelector('header').offsetHeight;
    const el = document.querySelector('.dashboard-business-alert');
    const rect = el.getBoundingClientRect();

    const calcHeight = rect.top - hh;

    if (calcHeight > 0) {
      this.setState({
        containerClass: '',
        bannerPadding: 420 - calcHeight < 160 ? 420 - calcHeight : 160
      });
    } else {
      this.setState({
        containerClass: 'fixed-banner',
        bannerPadding: 0
      });
    }
  }

  openNewsViewModal(news) {
    this.setState({
      selectedNews: news
    });

    setTimeout(() => {
      this.newsViewModal.open();
    }, 100);
  }

  closeNewsViewModal() {
    this.newsViewModal.close();
  }

  setNews = news => {
    this.setState({
      selectedNews: news
    });
  };

  newsLeft = () => {
    const { selectedNews, currentCount } = this.state;
    const { news } = this.props;
    const newsData = news && news.length > 0 ? news.slice(0, currentCount) : [];
    const index = newsData.findIndex(
      item => item.news_id === selectedNews.news_id
    );
    if (index === 0) return;
    this.setNews(newsData[index - 1]);
  };

  newsRight = () => {
    const { selectedNews, currentCount } = this.state;
    const { news } = this.props;
    const newsData = news && news.length > 0 ? news.slice(0, currentCount) : [];
    const index = newsData.findIndex(
      item => item.news_id === selectedNews.news_id
    );
    if (index >= newsData.length - 1) return;
    this.setNews(newsData[index + 1]);
  };

  openPinterestShare = e => {
    const { selectedNews } = this.state;
    const url = `${document.location.origin}/news/view/${selectedNews.slug}`;
    window.open(
      `https://www.pinterest.com/pin/create/button/?description=${selectedNews.title}&media=${selectedNews.cover}&url=${url}`,
      'Weibo',
      'height:700, width:700'
    );
  };

  openFacebookShare = () => {
    const { selectedNews } = this.state;
    const url = `${document.location.origin}/news/view/${selectedNews.slug}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'Facebook',
      'height:700, width:700'
    );
  };

  openTwitterShare = e => {
    const { selectedNews } = this.state;
    const url = `${document.location.origin}/news/view/${selectedNews.slug}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${url}`,
      'Twitter',
      'height:700, width:700'
    );
  };

  newsLoadMore() {
    const { news } = this.props;
    const { currentCount } = this.state;

    if (news.length <= currentCount) return;

    this.setState({
      currentCount: currentCount + 2
    });
  }

  addToCart(qualification_id) {
    const { addToCart, router } = this.props;
    router.push('/store/basket');
    addToCart(qualification_id, 1);
  }

  render() {
    const {
      containerClass,
      bannerPadding,
      mockData,
      selectedNews,
      currentCount
    } = this.state;
    const {
      items,
      setItemCount,
      news,
      user,
      centre,
      qualifications
    } = this.props;

    // let mockNews = mockData.news;

    // if (config.rssNewsUrl !== '') {
    //   mockNews = [
    //     {
    //       thumbnail: '',
    //       title: '',
    //       description: '',
    //       pubDate: ''
    //     }
    //   ];
    // }

    // const newsData =
    //   news && news.length > 0
    //     ? news.slice(0, currentCount)
    //     : mockNews.slice(0, currentCount);

    const newsData = news && news.length > 0 ? news.slice(0, currentCount) : [];
    let centreProfile = extractUserCentre(user);
    if (centre.profile) {
      centreProfile = centre.profile;
    }
    const isVideoBanner = !(
      centreProfile.cloudinary_file_id &&
      (centreProfile.cloudinary_file_id.includes('jpeg') ||
        centreProfile.cloudinary_file_id.includes('png') ||
        centreProfile.cloudinary_file_id.includes('jpg'))
    );
    return (
      <div className={`dashboard-business ${containerClass}`}>
        <DashboardBusinessHeader
          {...{
            bannerPadding,
            centreProfile,
            isVideoBanner
          }}
        />

        <section className="content-section p-b-20 dashboard-business-content">
          <div className="hidden-card-title is-hidden-touch">
            <div className="container">
              <div className="columns is-multiline">
                <div className="column is-3-widescreen is-4-desktop is-12-tablet is-12-mobile">
                  <div className="card-title">
                    <img src={centreProfile.logo} alt="" />
                    {lodash.get(centreProfile, 'screen_name', '')}
                    {/* {mockData.title} */}
                  </div>
                </div>
                <div className="column is-6-widescreen is-4-desktop is-12-tablet is-12-mobile">
                  <div className="card-title">Latest News</div>
                </div>
                <div className="column is-3-widescreen is-4-desktop is-12-tablet is-12-mobile">
                  <div className="card-title">Purchase</div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="columns is-multiline">
              <div className="column is-3-widescreen is-4-desktop is-12-tablet is-12-mobile">
                <div className="columns is-multiline">
                  <div className="column is-12-widescreen is-12-desktop is-6-tablet is-6-mobile p-b-0">
                    <DashboardBusinessCardAlert
                      {...{
                        mockData,
                        centreProfile
                      }}
                    />
                  </div>
                  <div className="column is-12-widescreen is-12-desktop is-6-tablet is-6-mobile p-b-0">
                    <DashboardBusinessCardUsers
                      {...{
                        mockData,
                        centreProfile
                      }}
                    />
                  </div>
                  {/* <div className="column is-12-widescreen is-12-desktop is-6-tablet is-6-mobile p-t-0">
                    <div className="card-title first">Current Awards</div>
                    <DashboardBusinessCardAwards
                      {...{
                        mockData
                      }}
                    />
                  </div> */}
                </div>
              </div>
              <div className="column is-6-widescreen is-4-desktop is-12-tablet is-12-mobile is-paddingless p-t-10">
                <div className="card-title p-l-10">Latest News</div>
                <DashboardBusinessNews
                  {...{
                    openNewsViewModal: this.openNewsViewModal,
                    newsLoadMore: this.newsLoadMore,
                    data: newsData
                  }}
                />
              </div>
              <div className="column is-3-widescreen is-4-desktop is-12-tablet is-12-mobile">
                <div className="columns is-multiline">
                  {/* <div className="column is-12-widescreen is-12-desktop is-6-tablet is-6-mobile p-b-0">
                    <div className="card-title">Purchase</div>
                    <DashboardBusinessCardStore
                      {...{
                        items,
                        setItemCount,
                        mockData,
                        qualifications,
                        addToCart: this.addToCart
                      }}
                    />
                  </div> */}
                  <div className="column is-12-widescreen is-12-desktop is-6-tablet is-6-mobile p-t-0">
                    <DashboardBusinessCardChat
                      {...{
                        mockData
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContentModal
          className="news-view-modal"
          ref={e => {
            this.newsViewModal = e;
          }}
        >
          <DashboardBusinessNewsView
            {...{
              selectedNews,
              news: newsData,
              setNews: this.setNews,
              newsLeft: this.newsLeft,
              newsRight: this.newsRight,
              openFacebookShare: this.openFacebookShare,
              openPinterestShare: this.openPinterestShare,
              openTwitterShare: this.openTwitterShare
            }}
          />
        </ContentModal>
      </div>
    );
  }
}

const mapStateToProps = ({ store, profile, centre }) => ({
  items: getCartDetails(store),
  user: profile.user,
  centre: centre,
  qualifications: path(['qualifications'], store)
});

const mapDispatchToProps = dispatch => ({
  setItemCount: (i, c) => dispatch(StoreActions.setItemCount(i, c)),
  getAllQualificationsInStoreAttempt: params =>
    dispatch(StoreActions.getAllQualificationsInStoreAttempt(params)),
  addToCart: (qualification_id, count = 1) =>
    dispatch(StoreActions.addToCart(qualification_id, count))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBusiness);
