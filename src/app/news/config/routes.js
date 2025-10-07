import React from 'react';
import { Route } from 'react-router';
import {
  NewsContainer,
  NewsViewContainer,
  NewsFeedListContainer,
  NewsFeedEditContainer,
  NewsListContainer,
  NewsEditContainer,
  NewsArticleEditorContainer,
  NewsSectorSelectionContainer
} from '../containers';

const NewsRoutes = (
  <Route>
    <Route path="news" component={NewsContainer} />
    <Route path="news/featured" component={NewsContainer} />
    <Route path="news/inspired" component={NewsContainer} />
    <Route path="news/archived" component={NewsContainer} />
    <Route path="news/view/(:newsSlug)" component={NewsViewContainer} />

    <Route path="news/article" component={NewsListContainer} />
    <Route path="news/article/:news_id" component={NewsEditContainer} />

    <Route path="news/provider" component={NewsFeedListContainer} />
    <Route path="news/provider/:feed_id" component={NewsFeedEditContainer} />
  </Route>
);

export default NewsRoutes;
