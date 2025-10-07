import React, { useState } from 'react';
import cx from 'classnames';
import { cond, equals, always, T } from 'ramda';
import GridLayout from 'react-grid-layout';

import common from 'app/common';

import ProfileMediaGridItem from '../../profile-media-grid-item';

const {
  components: { ContentModalNew }
} = common;

const mockMedia = {
  description: 'test',
  is_public: 1,
  media_id: 8979,
  media_url:
    'https://seg-testing.s3.eu-west-1.amazonaws.com/testing/1482-45159301-5ef64f8f88329.jpg',
  showreel: 0,
  title: '45159301d.jpg',
  type: 'photo'
};

function ProfileMediaAlbumsEdit({
  profile,
  optionsEnable,
  editAlbumModal,
  closeEditAlbumModal,
  setPostToDeleteFromAlbum
}) {
  const [modalView, setModalView] = useState('table');
  const [layout, setLayout] = useState([
    { i: '1', x: 0, y: 0, w: 1, h: 1 },
    { i: '2', x: 1, y: 0, w: 1, h: 1 },
    { i: '3', x: 2, y: 0, w: 1, h: 1 },
    { i: '4', x: 3, y: 0, w: 1, h: 1 },
    { i: '5', x: 4, y: 0, w: 1, h: 1 },
    { i: '6', x: 0, y: 1, w: 1, h: 1 },
    { i: '7', x: 1, y: 1, w: 1, h: 1 },
    { i: '8', x: 2, y: 1, w: 1, h: 1 },
    { i: '9', x: 3, y: 1, w: 1, h: 1 },
    { i: '10', x: 4, y: 1, w: 1, h: 1 },
    { i: '11', x: 0, y: 2, w: 1, h: 1 },
    { i: '12', x: 1, y: 2, w: 1, h: 1 },
    { i: '13', x: 2, y: 2, w: 1, h: 1 }
  ]);

  const fixLayout = () => {
    const maxY = 40;
    const maxRowXs = layout
      .map(item => (item.y === maxY ? item.x : null))
      .filter(value => value !== null);

    const xs = [0, 1, 2, 3, 4];

    const missingX = xs.find(value =>
      maxRowXs.every(maxRowX => maxRowX !== value)
    );

    const fixedLayout = layout.map(item => {
      if (item.y > maxY) {
        return {
          ...item,
          y: maxY,
          x: missingX
        };
      }
      return item;
    });
    return fixedLayout;
  };

  const onLayoutChange = layout => {
    const fixedLayout = fixLayout(layout);
    setLayout(fixedLayout);
  };

  const handleClose = () => {
    setModalView('grid');
    closeEditAlbumModal();
  };

  return (
    <ContentModalNew
      size="larger"
      isOpened={editAlbumModal}
      onClose={handleClose}
      className={cx({
        'profile-media-albums-edit--full-width': modalView === 'media'
      })}
    >
      <div className="profile-media-albums-edit">
        <div className="profile-media-albums-edit__head">
          <div className="profile-media-albums-edit__head__info">
            <div className="profile-media-albums-edit__head__info__title">
              Edit
            </div>
            <img
              src="https://seg-testing.s3.eu-west-1.amazonaws.com/testing/1482-955a8045-b-5fb4032eb7c82.png"
              className="profile-media-albums-edit__head__info__img"
              alt=""
            />
            <div className="profile-media-albums-edit__head__info__posts">
              14 Posts
            </div>
          </div>
          <div className="p-t-30">
            <button className="button" onClick={handleClose}>
              Cancel
            </button>
            {modalView === 'media' && (
              <button
                className="button profile-media-albums-edit__save-btn"
                onClick={handleClose}
              >
                Save
              </button>
            )}
          </div>
        </div>
        <div className="profile-media-albums-edit__title-container">
          {modalView !== 'media' && (
            <div>
              <div className="profile-media-albums-edit__title">
                Album Title
              </div>
              <div className="profile-media-albums-edit__description">
                Album Description
              </div>
            </div>
          )}
          {modalView === 'grid' && (
            <div
              className="profile-media-albums-edit__title__select"
              onClick={() => {
                setModalView('table');
              }}
            >
              Select
            </div>
          )}
        </div>
        {cond([
          [
            equals('grid'),
            always(
              <div className="profile-media-albums-edit__posts">
                <GridLayout
                  className="layout"
                  layout={layout}
                  onLayoutChange={onLayoutChange}
                  cols={5}
                  maxRows={3}
                  rowHeight={150}
                  width={813}
                  margin={[4, 4]}
                  isBounded
                >
                  <div
                    key="1"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="2"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="3"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="4"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="5"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="6"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="7"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="8"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="9"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="10"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="11"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="12"
                    className="profile-media-albums-edit__posts__item"
                  />
                  <div
                    key="13"
                    className="profile-media-albums-edit__posts__item"
                  />
                </GridLayout>
              </div>
            )
          ],
          [
            equals('table'),
            always(
              <div className="profile-media-albums-edit__table">
                <div className="profile-media-albums-edit__table__header">
                  <i className="fa fa-angle-left" />
                  <button
                    className="button"
                    onClick={() => {
                      setModalView('grid');
                    }}
                  >
                    Close
                  </button>
                  <i className="fa fa-angle-right" />
                </div>
                <div className="profile-media-albums-edit__table__body">
                  <div className="profile-media-albums-edit__table__body__info">
                    <div className="profile-media-albums-edit__table__body__info__title">
                      Media title
                    </div>
                    <div className="profile-media-albums-edit__table__body__info__description">
                      Media description
                    </div>
                  </div>
                </div>
                <div className="profile-media-albums-edit__table__footer">
                  <i
                    className="fa fa-pencil"
                    onClick={() => {
                      setModalView('media');
                    }}
                  />
                  <i
                    className="fa fa-trash-o"
                    onClick={() => {
                      setPostToDeleteFromAlbum(1);
                    }}
                  />
                </div>
              </div>
            )
          ],
          [
            T,
            always(
              <div className="profile-media-grid">
                <ProfileMediaGridItem
                  {...{
                    profile,
                    media: mockMedia,
                    optionsEnable: false,
                    editMode: true,
                    editingPhoto: false,
                    editingVideo: false,
                    setEditMode: () => {},
                    setSelectedItem: () => {},
                    editMemberPhoto: () => {},
                    editMemberVideo: () => {},
                    setMediaToDelete: () => {}
                  }}
                  editale
                  removeButtons
                />
              </div>
            )
          ]
        ])(modalView)}
      </div>
    </ContentModalNew>
  );
}

export default ProfileMediaAlbumsEdit;
