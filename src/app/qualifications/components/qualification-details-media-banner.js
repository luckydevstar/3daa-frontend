import React, { useState, useRef, useEffect } from 'react';
import common from 'app/common';

const {
  components: { MediaCrop }
} = common;

function QualificationDetailsMediaBanner({
  setDesktopBanner,
  setMobileBanner,
  mobileBanner,
  desktopBanner,
  editable
}) {
  const [mobileCropModal, setMobileCropModal] = useState(false);
  const [desktopCropModal, setDesktopCropModal] = useState(false);

  const desktopVideoBannerRef = useRef(null);
  const mobileVideoBannerRef = useRef(null);

  const handleSetMobileBanner = e => {
    const file = e.target.files[0];
    const isImage = file.type.includes('image');
    setMobileBanner({
      file,
      isImage,
      url: URL.createObjectURL(file)
    });
    if (isImage) {
      setMobileCropModal(true);
    }
  };

  const handleSetDesktopBanner = e => {
    const file = e.target.files[0];
    const isImage = file.type.includes('image');
    setDesktopBanner({
      file,
      isImage,
      url: URL.createObjectURL(file)
    });
    if (isImage) {
      setDesktopCropModal(true);
    }
  };

  const acceptMobileBannerCrop = file => {
    const isImage = file.type.includes('image');
    setMobileBanner({
      file,
      isImage,
      url: URL.createObjectURL(file)
    });
    setMobileCropModal(false);
  };

  const acceptDesktopBannerCrop = file => {
    const isImage = file.type.includes('image');
    setDesktopBanner({
      file,
      isImage,
      url: URL.createObjectURL(file)
    });
    setDesktopCropModal(false);
  };

  useEffect(() => {
    if (mobileVideoBannerRef && mobileBanner && !mobileBanner.isImage) {
      mobileVideoBannerRef.current.load();
      mobileVideoBannerRef.current.play();
    }
  }, [mobileBanner]);

  useEffect(() => {
    if (desktopVideoBannerRef && desktopBanner && !desktopBanner.isImage) {
      desktopVideoBannerRef.current.load();
      desktopVideoBannerRef.current.play();
    }
  }, [desktopBanner]);

  return (
    <div className="qualification-details-media-banner-container">
      <div className="qualification-details-media-banner">
        <label htmlFor="qualification-details-media-banner__mobile">
          <div className="qualification-details-media-banner__mobile">
            {!mobileBanner && <img src="/assets/images/upload_icon.png" />}
            {!mobileBanner && <div>Upload</div>}
            {mobileBanner && mobileBanner.isImage && (
              <img
                className="qualification-details-media-banner__mobile__banner"
                src={mobileBanner.url}
                alt=""
              />
            )}
            {mobileBanner && !mobileBanner.isImage && (
              <video ref={mobileVideoBannerRef} muted autoPlay loop playsInline>
                <source src={mobileBanner.url} />
              </video>
            )}
          </div>
          {editable && (
            <input
              type="file"
              id="qualification-details-media-banner__mobile"
              onChange={handleSetMobileBanner}
            />
          )}
        </label>

        <div className="qualification-details-media-banner__desktop">
          <img src="/assets/images/macbook_pro_retina.png" />
          <label htmlFor="qualification-details-media-banner__desktop__banner">
            <div className="qualification-details-media-banner__desktop__banner">
              {!desktopBanner && <img src="/assets/images/upload_icon.png" />}
              {!desktopBanner && <div>Upload</div>}
              {desktopBanner && desktopBanner.isImage && (
                <img
                  src={desktopBanner.url}
                  className="qualification-details-media-banner__desktop__banner__img"
                />
              )}
              {desktopBanner && !desktopBanner.isImage && (
                <video
                  ref={desktopVideoBannerRef}
                  muted
                  autoPlay
                  loop
                  playsInline
                >
                  <source src={desktopBanner.url} />
                </video>
              )}
            </div>
          </label>
          {editable && (
            <input
              type="file"
              id="qualification-details-media-banner__desktop__banner"
              onChange={handleSetDesktopBanner}
            />
          )}
        </div>
      </div>
      <p>
        Add media banners that can add an identity experience to the
        qualification
      </p>
      <p>This will display on the Leaners dashboard only</p>
      {mobileCropModal && mobileBanner && (
        <MediaCrop
          onClose={() => {
            setMobileCropModal(null);
          }}
          mediaSrc={mobileBanner.url}
          acceptCrop={acceptMobileBannerCrop}
        />
      )}
      {desktopCropModal && desktopBanner && (
        <MediaCrop
          onClose={() => {
            setDesktopCropModal(null);
          }}
          mediaSrc={desktopBanner.url}
          acceptCrop={acceptDesktopBannerCrop}
        />
      )}
    </div>
  );
}

export default QualificationDetailsMediaBanner;
