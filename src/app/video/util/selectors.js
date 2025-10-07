import { createSelector } from 'reselect';
import {
  filter,
  propEq,
  prop,
  pipe,
  find,
  not,
  map,
  sortBy,
  descend,
  sort,
  either,
  indexOf
} from 'ramda';

// Filter videos on category selected & search term
export const filterVideos = createSelector(
  video => video.videos,
  video => video.selectedCategory,
  video => video.selectedSubCategory,
  video => video.searchTerm,
  video => video.categories,
  (videos, selectedCategory, selectedSubCategory, searchTerm, categories) => {
    let categoryIDs = [];
    if (categories) {
      map(category => {
        categoryIDs.push(category.video_category_id);
        if (category.subcategories && category.subcategories.length > 0) {
          map(sub_category => {
            categoryIDs.push(sub_category.video_category_id);
          })(category.subcategories);
        }
      })(categories);
    }

    if (searchTerm) {
      videos = filter(
        x =>
          x.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.description.toLowerCase().includes(searchTerm.toLowerCase()),
        videos
      );
    } else if (selectedSubCategory > 0) {
      videos = filter(
        pipe(
          prop('video_categories'),
          find(propEq('video_category_id', selectedSubCategory))
        )
      )(videos);
    } else if (selectedCategory > 0) {
      videos = filter(
        pipe(
          prop('video_categories'),
          find(
            either(
              propEq('video_category_parent_id', selectedCategory),
              propEq('video_category_id', selectedCategory)
            )
          )
        )
      )(videos);
    }

    const multiArr = [];
    map(x => {
      pipe(
        prop('video_categories'),
        map(y => {
          if (
            categoryIDs.length > 0 &&
            indexOf(y.video_category_parent_id, categoryIDs) !== -1
          ) {
            if (
              pipe(
                find(propEq('video_category_id', y.video_category_id)),
                not
              )(multiArr)
            ) {
              let category_description = '';

              if (categories) {
                if (
                  y.video_category_parent_id === '' ||
                  y.video_category_parent_id === null
                ) {
                  category_description = find(
                    propEq('video_category_id', y.video_category_id)
                  )(categories).description;
                } else {
                  category_description = find(
                    propEq('video_category_id', y.video_category_parent_id)
                  )(categories).description;
                }
              }

              const arr = {
                video_category_title: y.title,
                video_category_id: y.video_category_id,
                video_category_description: category_description,
                data: [x]
              };
              multiArr.push(arr);
            } else {
              find(propEq('video_category_id', y.video_category_id))(
                multiArr
              ).data.push(x);
            }
          }
        })
      )(x);
    })(videos);
    videos = multiArr;
    videos = sortBy(prop('video_category_id'))(videos);

    return videos;
  }
);

export const filterLikedVideos = createSelector(
  video => video.videos,
  video => video.searchTerm,
  video => video.selectedCategory,
  video => video.selectedSubCategory,
  (likedVideos, searchTerm, selectedCategory, selectedSubCategory) => {
    if (searchTerm) {
      likedVideos = filter(
        x =>
          x.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.description.toLowerCase().includes(searchTerm.toLowerCase()),
        likedVideos
      );
    }
    if (selectedSubCategory > 0) {
      likedVideos = filter(
        pipe(
          prop('video_categories'),
          find(propEq('video_category_id', selectedSubCategory))
        )
      )(likedVideos);
    } else if (selectedCategory > 0) {
      likedVideos = filter(
        pipe(
          prop('video_categories'),
          find(
            either(
              propEq('video_category_parent_id', selectedCategory),
              propEq('video_category_id', selectedCategory)
            )
          )
        )
      )(likedVideos);
    }

    likedVideos = filter(pipe(prop('member_actions'), propEq('liked', 1)))(
      likedVideos
    );
    return likedVideos;
  }
);

export const filterViewedVideos = createSelector(
  video => video.videos,
  video => video.searchTerm,
  video => video.selectedCategory,
  video => video.selectedSubCategory,
  (viewedVideos, searchTerm, selectedCategory, selectedSubCategory) => {
    if (searchTerm) {
      viewedVideos = filter(
        x =>
          x.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.description.toLowerCase().includes(searchTerm.toLowerCase()),
        viewedVideos
      );
    }
    if (selectedSubCategory > 0) {
      viewedVideos = filter(
        pipe(
          prop('video_categories'),
          find(propEq('video_category_id', selectedSubCategory))
        )
      )(viewedVideos);
    } else if (selectedCategory > 0) {
      viewedVideos = filter(
        pipe(
          prop('video_categories'),
          find(
            either(
              propEq('video_category_parent_id', selectedCategory),
              propEq('video_category_id', selectedCategory)
            )
          )
        )
      )(viewedVideos);
    }

    viewedVideos = filter(pipe(prop('member_actions'), propEq('viewed', 1)))(
      viewedVideos
    );
    return viewedVideos;
  }
);

export const filterManageVideos = createSelector(
  video => video.videos,
  video => video.selectedSubCategory,
  video => video.searchTerm,
  (videos, selectedSubCategory, searchTerm) => {
    if (searchTerm) {
      videos = filter(
        x =>
          x.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.description.toLowerCase().includes(searchTerm.toLowerCase()),
        videos
      );
    }
    videos = filter(
      pipe(
        prop('video_categories'),
        find(propEq('video_category_id', selectedSubCategory))
      )
    )(videos);

    return videos;
  }
);

export const filterManageCategories = createSelector(
  video => video.categories,
  video => video.selectedSector,
  (categories, selectedSector) => {
    if (categories && categories.length > 0) {
      categories = filter(
        propEq('abstract_sector_id', selectedSector),
        categories
      );
    }

    return categories;
  }
);

export const filterCarouselVideos = createSelector(
  video => video.videos,
  video => video.categories,
  (videos, categories) => {
    let categoryIDs = [];
    if (categories) {
      map(category => {
        categoryIDs.push(category.video_category_id);
        if (category.subcategories && category.subcategories.length > 0) {
          map(sub_category => {
            categoryIDs.push(sub_category.video_category_id);
          })(category.subcategories);
        }
      })(categories);
    }

    videos = sort(descend(prop('viewed')))(videos);
    const filteredVideos = [];
    map(x => {
      pipe(
        prop('video_categories'),
        map(y => {
          if (
            categoryIDs.length > 0 &&
            indexOf(y.video_category_id, categoryIDs) !== -1
          ) {
            if (
              pipe(
                find(propEq('video_category_id', y.video_category_id)),
                not
              )(filteredVideos)
            ) {
              const arr = {
                video_category_title: y.title,
                video_category_id: y.video_category_id,
                data: x
              };
              filteredVideos.push(arr);
            }
          }
        })
      )(x);
    })(videos);
    return filteredVideos;
  }
);

export const filterVideosExceptOwn = (videos, category_id, mediaId) => {
  if (category_id) {
    videos = filter(
      pipe(
        prop('video_categories'),
        find(propEq('video_category_id', parseInt(category_id)))
      )
    )(videos);
  }
  videos = filter(pipe(propEq('media_id', mediaId), not))(videos);
  return videos;
};

export const filterVideosByActionCategory = (videos, category_id) => {
  if (category_id) {
    videos = filter(
      pipe(
        prop('video_categories'),
        find(propEq('video_category_id', parseInt(category_id)))
      )
    )(videos);
  }
  videos = filter(pipe(prop('member_actions'), propEq('liked', 0)))(videos);
  return videos;
};

export const filterVideosByActionSector = (videos, sector_id) => {
  if (sector_id) {
    videos = filter(propEq('sector_id', parseInt(sector_id)))(videos);
  }
  return videos;
};
