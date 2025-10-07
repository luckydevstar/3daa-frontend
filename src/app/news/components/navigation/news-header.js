import React from 'react';
import cx from 'classnames';

const createBothPreview = (file, cloudinaryMediaType) => {
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
};

const Header = ({ title, subTitle, isView, goBack }) => (
  <section className="content-section hero smaller news-header">
    <div className="hero-body">
      <div className="container">
        <div className="columns">
          {goBack && (
            <div className="column no-grow">
              <a className="back-button" onClick={() => goBack()} />
            </div>
          )}
          <div className="column is-10">
            <h1
              className={cx('title', {
                'has-text-primary': isView
              })}
            >
              {title}
            </h1>
            <h2 className="subtitle">{subTitle}</h2>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Header;
