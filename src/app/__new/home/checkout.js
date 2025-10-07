import React from "react";
import Slider from "react-slick";
import FlippableCard from "../common/flippable-card";

import Card1Image from "images/new/home/checkout_card_1.png";
import Card2Image from "images/new/home/checkout_card_2.jpg";
import Card3Image from "images/new/home/checkout_card_3.jpg";
import Card4Image from "images/new/home/checkout_card_4.png";

import LogoImage from "images/new/home/logo.png";

const CARD_DATA = [
    {
        frontImage: Card1Image,
        backImage: Card1Image,
        title: "Still Renders",
        subtitle: "Training Programme",
        logo: LogoImage,
        isComingSoon: false,
    },
    {
        frontImage: Card2Image,
        backImage: Card2Image,
        title: "360 Virtual Tours",
        subtitle: "Training Programme",
        logo: LogoImage,
        isComingSoon: true,
    },
    {
        frontImage: Card3Image,
        backImage: Card3Image,
        title: "Flythroughs",
        subtitle: "Training Programme",
        logo: LogoImage,
        isComingSoon: true,
    },
    {
        frontImage: Card4Image,
        backImage: Card4Image,
        title: "Simulations",
        subtitle: "Training Programme",
        logo: LogoImage,
        isComingSoon: true,
    },
]

const HomeCheckout = () => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    }

    return (
        <div className="max-w-7xl mx-auto pt-16 pb-12">
            <div className="flex flex-col gap-6 justify-center items-center mb-20">
                <h2 className="text-5xl font-bold">Check Out</h2>
                <h2 className="text-5xl font-bold text-[#488AFF]">Online Training</h2>
            </div>
            <div>
                <Slider {...sliderSettings}>
                    {
                        CARD_DATA.map((item, idx) => {
                            return (
                                <div className="pb-20" key={idx}>
                                    <div className="flex justify-center w-full">
                                        <FlippableCard {...item} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </Slider>

            </div>
        </div>
    )
}

export default HomeCheckout;
