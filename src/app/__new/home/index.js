import React, { Fragment } from 'react';
import HomeHero from './hero';
import HomeShowcase from './showcase';
import HomeCheckout from './checkout';
import HomeIntro from './intro';
import ApplyCard from './applycard';
import CheckCard from './checkcard';
import JobSearch from './jobsearch';
import Join3DAA from './join3daa';

const Home = () => {
  return (
    <div className="bg-white">
      <HomeHero />
      <HomeShowcase />
      <HomeCheckout />
      <HomeIntro />
      <ApplyCard />
      <CheckCard />
      {/* <JobSearch /> */}
      <Join3DAA />
    </div>
  );
};

export default Home;
