import React from 'react';

import Image1 from 'images/new/home/home-img1.jpg';
import Image2 from 'images/new/home/home-img2.png';
import Image3 from 'images/new/home/home-img3.jpg';
import Image4 from 'images/new/home/home-img4.jpg';
import Image5 from 'images/new/home/home-img5.jpg';
import Image6 from 'images/new/home/home-img6.jpg';
import ImageLogo from 'images/new/home/logo.png';

const HomeShowcase = () => {
  return (
    <div className="relative flex justify-between items-end w-full overflow-hidden pt-2 mb-12">
      {/* Left stack */}
      <div className="pointer-events-none">
        <img
          className="w-60 h-auto object-contain rounded-xl -ml-[20px] z-30 relative"
          src={Image6}
        />
        <img
          className="w-72 h-auto object-contain rounded-xl -mt-[200px] z-10 ml-[280px]"
          src={Image5}
        />
        <img
          className="w-[432px] h-auto object-contain rounded-xl -mt-[60px] ml-[40px] z-20"
          src={Image4}
        />
      </div>

      {/* Centered logo (always horizontally centered) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-40 flex items-end justify-center">
        {/* Fix/scale width as you like; min-w ensures it never gets smaller; adjust numbers if needed */}
        <img
          className="min-w-40 w-40 sm:w-52 md:w-60 h-auto max-w-none"
          src={ImageLogo}
          alt="3DAA"
        />
      </div>

      {/* Right stack */}
      <div className="pointer-events-none">
        <img
          className="w-[180px] h-auto object-contain rounded-xl -ml-[40px] z-30 relative"
          src={Image3}
        />
        <img
          className="w-[320px] h-auto object-contain rounded-xl -mt-[120px] z-20 relative ml-[230px]"
          src={Image2}
        />
        <img
          className="w-[440px] h-auto object-contain rounded-xl -mt-[100px] mr-[40px] z-10"
          src={Image1}
        />
      </div>

      {/* Fade gradient */}
      <div
        className="absolute bottom-0 z-50 h-[300px] w-full"
        style={{ background: 'linear-gradient(to bottom, transparent, white)' }}
      />
    </div>
  );
};

export default HomeShowcase;
