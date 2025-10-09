import React from "react";
import Slider from "react-slick";

import Image4 from "images/new/home/home-img4.jpg";
import Image5 from "images/new/home/home-img5.jpg";
import Image6 from "images/new/home/home-img6.jpg";

const HomeIntro = () => {
  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots !bottom-2",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4500,
  };

  return (
    <section className="w-full bg-[#488AFF] min-h-[70vh] md:min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Grid: 1 col on mobile, 2 cols from md+ */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Collage (scaled and simplified on mobile) */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Top image */}
              <img
                src={Image6}
                alt="Collage 1"
                className="w-40 sm:w-48 md:w-60 h-auto object-contain rounded-xl relative z-30
                           -ml-2 sm:-ml-4 md:-ml-[20px]"
              />
              {/* Middle image */}
              <img
                src={Image5}
                alt="Collage 2"
                className="w-48 sm:w-56 md:w-72 h-auto object-contain rounded-xl
                           -mt-24 sm:-mt-32 md:-mt-[200px]
                           ml-16 sm:ml-24 md:ml-[230px] z-10"
              />
              {/* Bottom image */}
              <img
                src={Image4}
                alt="Collage 3"
                className="w-64 sm:w-80 md:w-[432px] h-auto object-contain rounded-xl
                           -mt-8 sm:-mt-10 md:-mt-[60px]
                           ml-4 sm:ml-6 md:ml-[40px] z-20"
              />
            </div>
          </div>

          {/* Right: Slider content */}
          <div className="flex items-center justify-center">
            <Slider {...sliderSettings} className="w-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-full">
                  <div className="flex flex-col items-center justify-center
                                  min-h-[220px] sm:min-h-[260px] md:min-h-[300px]
                                  gap-3 sm:gap-4 text-center not-prose">
                    <h1
                      className="font-extrabold text-white leading-tight
                                 !text-[clamp(28px,6vw,60px)]"
                    >
                      3D architectural Visualisations
                    </h1>
                    <p
                      className="text-white/95 leading-snug
                                 !text-[clamp(14px,4.2vw,22px)]
                                 max-w-[48ch] sm:max-w-[56ch] md:max-w-[62ch] mb-10"
                    >
                      At 3DAA, we pride ourselves on delivering high-quality,
                      practical training tailored to the evolving needs of the
                      architectural industry.
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeIntro;
