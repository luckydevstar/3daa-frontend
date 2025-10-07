import React, { Fragment } from "react"
import HomeHero from "./hero"
import HomeShowcase from "./showcase";
import HomeCheckout from "./checkout";
import HomeIntro from "./intro";

const Home = () => {
    return (
        <div className="bg-white">
            <HomeHero />
            <HomeShowcase />
            <HomeCheckout />
            <HomeIntro />
        </div>
    )
}

export default Home;
