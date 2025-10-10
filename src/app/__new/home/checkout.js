import React from 'react';
import Slider from 'react-slick';
import FlippableCard from '../common/flippable-card';

import Card1Image from 'images/new/home/checkout_card_1.png';
import Card2Image from 'images/new/home/checkout_card_2.jpg';
import Card3Image from 'images/new/home/checkout_card_3.jpg';
import Card4Image from 'images/new/home/checkout_card_4.png';
import LogoImage from 'images/new/home/logo.png';

const CARD_DATA = [
  {
    frontImage: Card1Image,
    backImage: Card1Image,
    title: 'Still Renders',
    subtitle: 'Training Programme',
    logo: LogoImage,
    isComingSoon: false
  },
  {
    frontImage: Card2Image,
    backImage: Card2Image,
    title: '360 Virtual Tours',
    subtitle: 'Training Programme',
    logo: LogoImage,
    isComingSoon: true
  },
  {
    frontImage: Card3Image,
    backImage: Card3Image,
    title: 'Flythroughs',
    subtitle: 'Training Programme',
    logo: LogoImage,
    isComingSoon: true
  },
  {
    frontImage: Card4Image,
    backImage: Card4Image,
    title: 'Simulations',
    subtitle: 'Training Programme',
    logo: LogoImage,
    isComingSoon: true
  }
];

const HomeCheckout = () => {
  const sliderSettings = {
    dots: true,
    dotsClass: 'slick-dots !bottom-0',
    arrows: true,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,

    // react-slick breakpoints are max-width based (mobile-last by default)
    responsive: [
      {
        breakpoint: 1024, // <= 1024px → tablets
        settings: {
          slidesToShow: 2,
          arrows: true
        }
      },
      {
        breakpoint: 768, // <= 768px → large phones
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '24px' // a bit of gutter on the sides
        }
      },
      {
        breakpoint: 480, // <= 480px → small phones
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '16px'
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
      {/* Heading */}
      <div className="flex flex-col gap-2 sm:gap-3 justify-center items-center mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
          Check Out
        </h2>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#488AFF] text-center">
          Online Training
        </h2>
      </div>

      {/* Slider */}
      <Slider {...sliderSettings}>
        {CARD_DATA.map((item, idx) => (
          <div className="pb-12 sm:pb-16" key={idx}>
            {/* Constrain each card’s width so layouts look great at all sizes */}
            <div className="flex justify-center w-full">
              <div className="flex justify-center w-full max-w-[360px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[440px]">
                {/* If your FlippableCard accepts a className/size prop, you can pass it instead */}
                <FlippableCard {...item} />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeCheckout;
