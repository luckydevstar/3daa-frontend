import React from 'react';
import Image4 from 'images/new/home/home-img4.jpg';
import Image5 from 'images/new/home/home-img5.jpg';
import Image6 from 'images/new/home/home-img6.jpg';
import Slider from 'react-slick';

const HomeIntro = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  return (
    <div className="w-full bg-[#488AFF] ">
      <div className="py-40 grid grid-cols-2 max-w-7xl mx-auto">
        <div className="col-span-1 flex items-center">
          <div>
            <img
              className="w-60 h-auto object-contain rounded-xl -ml-[20px] z-30 relative"
              src={Image6}
            />
            <img
              className="w-72 h-auto object-contain rounded-xl -mt-[200px] z-10 ml-[230px]"
              src={Image5}
            />
            <img
              className="w-[432px] h-auto object-contain rounded-xl -mt-[60px] ml-[40px] z-20"
              src={Image4}
            />
          </div>
        </div>
        <div className="col-span-1 items-center justify-center h-full">
          <Slider {...sliderSettings} className="h-full">
            <div className=" h-full">
              <div className="flex flex-col justify-center items-center h-full gap-2">
                <h1 className="text-[60px] line text-center font-[900] leading-tight text-[white]">
                  3D architectural Visualisations
                </h1>
                <p className="text-center text-[white] text-[22px] text-wrap">
                  At 3DAA, we pride ourselves on delivering high-quality,
                  practical training tailored to the evolving needs of the
                  architectural industry.
                </p>
              </div>
            </div>
            <div className=" h-full">
              <div className="flex flex-col justify-center items-center h-full gap-10">
                <h1 className="text-[60px] line text-center font-[900] leading-tight text-[white]">
                  3D architectural Visualisations
                </h1>
                <p className="text-center text-[white] text-[22px] text-wrap">
                  At 3DAA, we pride ourselves on delivering high-quality,
                  practical training tailored to the evolving needs of the
                  architectural industry.
                </p>
              </div>
            </div>
            <div className=" h-full">
              <div className="flex flex-col justify-center items-center h-full gap-10">
                <h1 className="text-[60px] line text-center font-[900] leading-tight text-[white]">
                  3D architectural Visualisations
                </h1>
                <p className="text-center text-[white] text-[22px] text-wrap">
                  At 3DAA, we pride ourselves on delivering high-quality,
                  practical training tailored to the evolving needs of the
                  architectural industry.
                </p>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default HomeIntro;
