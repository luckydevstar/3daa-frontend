import React, { useState } from 'react';
import cx from 'classnames';

function ProfileMediaOptions({
  filters,
  search,
  changeOptionsEnable,
  selectedFilter,
  onSearch,
  openAddMediaModal,
  openAddDocumentModal,
  setSelectedFilter,
  isPostsPage,
  isDocumentsPage
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <div className="profile-media-options">
      <div className="profile-media-options__settings-upload">
        <div>
          {!isDocumentsPage && (
            <img
              onClick={changeOptionsEnable}
              src="/assets/images/profile-media-settings-icon.png"
              alt=""
            />
          )}
        </div>
        {!isDocumentsPage && (
          <div
            className="profile-media-options__upload"
            onClick={openAddMediaModal}
          >
            {isPostsPage && <span>+ upload media</span>}
          </div>
        )}
        {isDocumentsPage && (
          <div
            className="profile-media-options__upload"
            onClick={openAddDocumentModal}
          >
            <span>+ upload document</span>
          </div>
        )}
      </div>
      <div className="profile-media-options__search">
        <div className="profile-media-options__search__icon">
          <i className="fa fa-search" />
        </div>
        <input
          type="text"
          value={search}
          onChange={onSearch}
          placeholder="Search Media"
        />
        <div
          className={cx('profile-media-options__search__filters', {
            'profile-media-options__search__filters--open': filtersOpen
          })}
        >
          <div className="profile-media-options__search__filters__inner">
            <div className="profile-media-options__search__filters__inner__head">
              <div
                onClick={() => {
                  setFiltersOpen(!filtersOpen);
                }}
              >
                &times;
              </div>
              <i
                className="fa fa-sliders"
                onClick={() => {
                  setFiltersOpen(!filtersOpen);
                }}
              />
            </div>
            <div className="profile-media-options__search__filters__inner__items">
              {filters.map(filter => (
                <div
                  key={filter.id}
                  className="profile-media-options__search__filters__inner__items__item"
                  onClick={() => {
                    setSelectedFilter(filter);
                  }}
                >
                  <span>{filter.title}</span>
                  <input
                    type="radio"
                    disabled={!(selectedFilter.id === filter.id)}
                    onClick={() => {
                      setSelectedFilter(filter);
                    }}
                    checked
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileMediaOptions;
