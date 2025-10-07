import React from 'react';
import { Route } from 'react-router';
import { Roles } from 'app/core/config/constants';
import {
  VideosRoute,
  VideosFavouritesRoute,
  VideosPlayerRoute,
  VideosManagerRoute,
  VideosNewRoute,
  VideosHistoryRoute
} from '../containers';

const { SiteAdmin, SuperAdmin } = Roles;

const VideoRoutes = (
  <Route>
    <Route path="videos" component={VideosNewRoute} />
    <Route path="videos/favourites" component={VideosFavouritesRoute} />
    <Route path="videos/history" component={VideosHistoryRoute} />
    <Route
      path="videos/favourites/:category_id/:video_id"
      component={VideosPlayerRoute}
    />
    <Route
      path="videos/content-manager"
      component={VideosManagerRoute}
      allowRoles={[SiteAdmin, SuperAdmin]}
    />
    <Route
      path="videos/content-manager/:category_id/:video_id"
      component={VideosPlayerRoute}
    />
    <Route path="videos/:category_id/:video_id" component={VideosPlayerRoute} />
    <Route path="videos/my" component={VideosRoute} />
    <Route path="videos-new" component={VideosNewRoute} />
  </Route>
);

export default VideoRoutes;
