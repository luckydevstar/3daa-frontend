import React, { useState } from 'react';
import HeroSmart from './smart';
import AboutCopy from './copy';
import CardShowcase from './card';
import heroBg from 'images/new/about/background.jpg';

const About = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* HERO with overlayed photo + S.M.A.R.T */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 z-0 bg-[#2F6EF6]/70 backdrop-blur-[2px] md:backdrop-blur-[3px] lg:backdrop-blur-[4px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <HeroSmart />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-10 lg:py-14 z-100">
          <AboutCopy />
        </div>
        <div className="h-[200px]" />
      </div>

      {/* CARD showcase sits on white like your screenshot */}
      <div className="-mt-[230px]">
        <CardShowcase onOpen={() => setOpen(true)} />
      </div>
    </div>
  );
};

export default About;
