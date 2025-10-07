import React, { useEffect, useState, useRef } from 'react';
import Cropper from 'cropperjs';
import ReactSlider from 'react-slider';

import ContentModalNew from '../content-modal-new/content-modal';

function MediaCrop({ acceptCrop, mediaSrc, onClose }) {
  const [cropper, setCropper] = useState(null);
  const [zoomValue, setZoomValue] = useState(0);
  const cropRef = useRef(null);

  const rotate = () => {
    if (cropper) {
      cropper.rotate(45);
    }
  };

  const setZoom = value => {
    const { cropper, zoomValue } = this.state;
    if (cropper) {
      cropper.zoom(value - zoomValue);
      setZoomValue(value);
    }
  };

  const crop = () => {
    const canvas = cropper.getCroppedCanvas();

    canvas.toBlob(blob => {
      const file = new File(
        [blob],
        `${cropRef.current.src.replace(/^.*[\\\/]/, '')}.png`,
        {
          type: 'image/png'
        }
      );
      file.preview = URL.createObjectURL(blob);
      if (acceptCrop) {
        acceptCrop(file);
      }
      setCropper(null);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (cropRef && cropRef.current) {
        const cropper = new Cropper(cropRef.current, {
          aspectRatio: null,
          zoomOnWheel: false,
          checkCrossOrigin: true
        });
        setCropper(cropper);
        clearInterval(interval);
      }
    }, 10);
  }, []);

  return (
    <ContentModalNew
      {...{
        isOpened: true,
        onClose
      }}
    >
      <div className="dropzone-crop-block dropzone-crop-block--inner">
        <div className="dropzone-options">
          <i className="fa fa-picture-o zoom-out-icon" />
          <ReactSlider
            className="horizontal-slider"
            min={0}
            max={2}
            step={0.05}
            onChange={setZoom}
            value={zoomValue}
          />
          <i className="fa fa-picture-o zoom-in-icon" />
          <i className="fa fa-repeat rotate-icon" onClick={rotate} />
        </div>
        <div className="dropzone-crop-button" onClick={crop}>
          Accept
        </div>
        <div>
          <img src={mediaSrc} ref={cropRef} alt="" />
        </div>
      </div>
    </ContentModalNew>
  );
}

export default MediaCrop;
