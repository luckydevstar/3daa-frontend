import common from 'app/common';

const { util: { helpers: { addClass, removeClass } } } = common;

const profileHeaderConfig = {
  heroSlider: null,
  heroSliderPlaying: true,
  heroSliderSettings: {
    nextButton: null,
    prevButton: null,
    scrollbar: null,
    pagination: null,
    autoplay: 4000,
    effect: 'fade',
    speed: 3000,
    autoHeight: false,
    fade: {
      crossFade: false
    },
    onSlideChangeStart(swiper) {
      const index = swiper.activeIndex;
      const slides = document.querySelectorAll('.hero-slider .swiper-slide');

      const slide = slides[index - 1] || slides[slides.length - 1];
      addClass(slide, 'previous-slide');

      setTimeout(() => {
        removeClass(slide, 'previous-slide');
      }, 3500);
    }
  }
};

export default profileHeaderConfig;
