import React from 'react';
import Slider from 'react-slick';
import cx from 'classnames';

const PrevArrow = ({ className, onClick }) => (
  <div
    {...{
      className: cx(className, 'gallery-evidence-modal-add__slider__prev'),
      onClick
    }}
  >
    <i className="fa fa-angle-left" />
  </div>
);

const NextArrow = ({ className, onClick }) => (
  <div
    {...{
      className: cx(className, 'gallery-evidence-modal-add__slider__next'),
      onClick
    }}
  >
    <i className="fa fa-angle-right" />
  </div>
);

function GalleryEvidenceModalsAddSlider({ evidences }) {
  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 5,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };
  if (evidences && evidences.length === 0) return null;

  return (
    <div className="gallery-evidence-modal-add__slider">
      <Slider {...settings}>
        {evidences.map(evidence => (
          <div
            key={evidence.learning_progress_evidence_id}
            className="gallery-evidence-modal-add__slider__slide"
          >
            {evidence.cloudinary_file_id &&
              evidence.cloudinary_file_type === 'image' && (
                <img src={evidence.cloudinary_file_id} alt="" />
              )}
            {evidence.cloudinary_file_id &&
              evidence.cloudinary_file_type === 'video' && (
                <video>
                  <source src={evidence.cloudinary_file_id} />
                </video>
              )}
            {!evidence.cloudinary_file_id && (
              <div className="gallery-evidence-modal-add__slider__slide__inner" />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default GalleryEvidenceModalsAddSlider;
