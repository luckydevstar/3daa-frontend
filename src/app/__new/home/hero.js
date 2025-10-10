import React from 'react';
import Slider from 'react-slick';

const HomeHero = () => {
  const sliderSettings = {
    dots: true,
    dotsClass: 'slick-dots !bottom-0',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    mobileFirst: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000
  };

  // Wrapper keeps headings within ~92vw so they never get cropped by slick's overflow
  const Wrap = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto w-[min(92vw,64rem)] text-center not-prose">
      {children}
    </div>
  );

  // Tuned clamps: small enough to fit on 320px screens in one line (no cropping)
  const line1 =
    'font-black text-black leading-none !text-[clamp(18px,5.6vw,42px)] my-4';
  const line2 =
    'font-black text-[#488AFF] leading-none !text-[clamp(20px,6.6vw,50px)] my-4';
  const brand = '!text-[clamp(22px,7.2vw,60px)]';
  const line3 =
    'font-black text-[#488AFF] leading-none !text-[clamp(18px,5.6vw,42px)] my-4';

  const Slide = ({ children }: { children: React.ReactNode }) => (
    <div>
      <div className="flex min-h-[20vh] sm:min-h-[20vh] flex-col justify-center items-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4">
        <Wrap>{children}</Wrap>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 sm:py-16">
        <Slider {...sliderSettings}>
          <Slide>
            {/* exactly 3 lines */}
            <h3 className={`${line1} whitespace-nowrap`}>Sign up to</h3>
            <h3 className={`${line2} whitespace-nowrap`}>
              join the <span className={brand}>3DAA</span> community
            </h3>
            <h3 className={`${line3} whitespace-nowrap`}>this September</h3>
          </Slide>

          <Slide>
            <h3 className={`${line1} whitespace-nowrap`}>Sign up to</h3>
            <h3 className={`${line2} whitespace-nowrap`}>
              join the <span className={brand}>3DAA</span> community
            </h3>
            <h3 className={`${line3} whitespace-nowrap`}>this September</h3>
          </Slide>

          <Slide>
            <h3 className={`${line1} whitespace-nowrap`}>Sign up to</h3>
            <h3 className={`${line2} whitespace-nowrap`}>
              join the 3DAA community
            </h3>
            <h3 className={`${line3} whitespace-nowrap`}>this September</h3>
          </Slide>

          <Slide>
            <h3 className={`${line1} whitespace-nowrap`}>Sign up to</h3>
            <h3 className={`${line2} whitespace-nowrap`}>
              join the 3DAA community
            </h3>
            <h3 className={`${line3} whitespace-nowrap`}>this September</h3>
          </Slide>
        </Slider>
      </div>
    </div>
  );
};

export default HomeHero;
